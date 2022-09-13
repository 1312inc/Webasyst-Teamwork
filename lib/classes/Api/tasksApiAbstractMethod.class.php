<?php

/**
 * Class tasksApiAbstractMethod
 */
abstract class tasksApiAbstractMethod extends waAPIMethod
{
    public const METHOD_GET    = 'GET';
    public const METHOD_POST   = 'POST';
    public const METHOD_DELETE = 'DELETE';
    public const METHOD_PUT    = 'PUT';

    public const CAST_INT         = 'int';
    public const CAST_CALLBACK    = 'callback';
    public const CAST_FLOAT       = 'float';
    public const CAST_ARRAY       = 'array';
    public const CAST_STRING      = 'string';
    public const CAST_STRING_TRIM = 'string_trim';
    public const CAST_DATETIME    = 'datetime';
    public const CAST_ENUM        = 'enum';
    public const CAST_BOOLEAN     = 'boolean';

    /**
     * @var array
     */
    protected $jsonParams = [];

    /**
     * tasksApiAbstractMethod constructor.
     */
    public function __construct()
    {
        // check for json request type
        $content_type = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strcmp($content_type, 'application/json') === 0) {
            $this->jsonParams = json_decode(file_get_contents('php://input'), true);
        }

        parent::__construct();
    }

    /**
     * @param string   $name
     * @param bool     $required
     * @param int|null $type
     * @param mixed    $format
     *
     * @return array|int|mixed|null
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     */
    public function get($name, $required = false, ?string $type = null, $format = null)
    {
        if ($this->jsonParams && array_key_exists($name, $this->jsonParams)) {
            $value = $this->jsonParams[$name];
        } else {
            try {
                return $this->fromGet($name, $required);
            } catch (waAPIException $exception) {
                throw new tasksApiMissingParamException($name);
            }
        }

        try {
            return $value === null ? $value : $this->cast($value, $type, $format);
        } catch (tasksException $exception) {
            throw new tasksApiWrongParamException($name, $exception->getMessage());
        }
    }

    /**
     * @param string      $name
     * @param bool        $required
     * @param null|string $type
     * @param mixed       $format
     *
     * @return array|int|mixed|null
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     */
    public function post($name, $required = false, ?string $type = null, $format = null)
    {
        if ($this->jsonParams && array_key_exists($name, $this->jsonParams)) {
            $value = $this->jsonParams[$name];
        } else {
            try {
                $value = $this->fromPost($name, $required);
            } catch (waAPIException $exception) {
                throw new tasksApiMissingParamException($name);
            }
        }

        try {
            return $value === null ? $value : $this->cast($value, $type, $format);
        } catch (tasksException $exception) {
            throw new tasksApiWrongParamException($name, $exception->getMessage());
        }
    }

    public function execute()
    {
        try {
//            if (waSystemConfig::isDebug() || (new tasksLicenseCheckerService())->hasLicense()) {
                $handlerResult = $this->run();
//            } else {
//                $handlerResult = new tasksApiResponse(tasksApiResponseInterface::HTTP_UNAUTHORIZED, ['error' => 'expired']);
//            }

            $this->response = $handlerResult->getResponseBody();

            $responseCode = $handlerResult->getStatus();
        } catch (Throwable $exception) {
            $this->response = tasksApiErrorResponse::fromException($exception);
            $responseCode = $exception->getCode();
            if (!$responseCode && $this->response instanceof tasksApiResponseInterface) {
                $responseCode = $this->response->getStatus();
            } else {
                $responseCode = 400;
            }
        }

        wa()->getResponse()->setStatus($responseCode);
    }

    /**
     * @return tasksApiResponseInterface
     */
    abstract function run(): tasksApiResponseInterface;

    /**
     * @param string   $name
     * @param bool     $required
     * @param int|null $type
     * @param string   $format
     *
     * @return array|int|mixed|null
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     */
    protected function param($name, $required = false, ?string $type = null, string $format = '')
    {
        if ($this->jsonParams && array_key_exists($name, $this->jsonParams)) {
            $param = $this->jsonParams[$name];
        } else {
            $param = null;
            try {
                $param = $this->fromPost($name, $required);
            } catch (waAPIException $exception) {
            }

            if ($param === null) {
                try {
                    $param = $this->fromGet($name, $required);
                } catch (waAPIException $exception) {
                    throw new tasksApiMissingParamException($name);
                }
            }
        }

        try {
            return $param === null ? $param : $this->cast($param, $type, $format);
        } catch (tasksException $exception) {
            throw new tasksApiWrongParamException($name, $exception->getMessage());
        }
    }

    private function fromGet($name, $required = false)
    {
        $v = waRequest::get($name);
        if ($required && $v === null) {
            throw new waAPIException('invalid_param', 'Required parameter is missing: ' . $name, 400);
        }

        return $v;
    }

    private function fromPost($name, $required = false)
    {
        $v = waRequest::post($name);
        if ($required && $v === null) {
            throw new waAPIException('invalid_param', 'Required parameter is missing: ' . $name, 400);
        }

        return $v;
    }

    /**
     * @param             $var
     * @param string|null $type
     * @param mixed       $format
     *
     * @return array|DateTimeImmutable|float|int|string
     * @throws tasksException
     */
    private function cast($var, ?string $type, $format = null)
    {
        switch ($type) {
            case self::CAST_INT:
                return (int) $var;

            case self::CAST_FLOAT:
                return (float) $var;

            case self::CAST_BOOLEAN:
                return filter_var($var, FILTER_VALIDATE_BOOLEAN);

            case self::CAST_ARRAY:
                return (array) $var;

            case self::CAST_STRING_TRIM:
                return trim((string) $var);

            case self::CAST_DATETIME:
                $var = DateTimeImmutable::createFromFormat($format, $var);
                if ($var === false) {
                    throw new tasksException(sprintf('Wrong format %s for value %s', $format, $var));
                }

                return $var;

            case self::CAST_ENUM:
                if (is_array($format) && !in_array($var, $format, true)) {
                    throw new tasksException(
                        sprintf('Wrong value %s. Expected one of %s', $var, implode(', ', $format))
                    );
                }
                break;

            case self::CAST_STRING:
                return (string) $var;

            case self::CAST_CALLBACK:
                if (is_callable($format)) {
                    return $format($var);
                }

                throw new tasksException(
                    sprintf('Wrong value %s. No callable', $var)
                );

            default:
                return $var;
        }

        return $var;
    }

    public function __invoke(): tasksApiResponseInterface
    {
        return $this->run();
    }
}
