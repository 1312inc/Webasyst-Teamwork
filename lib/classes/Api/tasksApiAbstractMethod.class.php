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

    public const CAST_INT         = 1;
    public const CAST_FLOAT       = 2;
    public const CAST_ARRAY       = 3;
    public const CAST_STRING      = 4;
    public const CAST_STRING_TRIM = 5;
    public const CAST_DATETIME    = 6;

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
     * @param string   $format
     *
     * @return array|int|mixed|null
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     */
    public function get($name, $required = false, ?int $type = null, string $format = '')
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
     * @param string   $name
     * @param bool     $required
     * @param null|int $type
     * @param string   $format
     *
     * @return array|int|mixed|null
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     */
    public function post($name, $required = false, ?int $type = null, string $format = '')
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
            $handlerResult = $this->run();

            $this->response = $handlerResult->getResponseBody();
            wa()->getResponse()->setStatus($handlerResult->getStatus());
        } catch (Throwable $exception) {
            $this->response = tasksApiErrorResponse::fromException($exception);
            wa()->getResponse()->setStatus($this->response->getStatus());
        }
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
    protected function param($name, $required = false, ?int $type = null, string $format = '')
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
     * @param        $var
     * @param int    $type
     * @param string $format
     *
     * @return array|DateTimeImmutable|float|int|string
     * @throws tasksException
     */
    private function cast($var, int $type, string $format = '')
    {
        switch ($type) {
            case self::CAST_INT:
                return (int) $var;

            case self::CAST_FLOAT:
                return (float) $var;

            case self::CAST_ARRAY:
                return (array) $var;

            case self::CAST_STRING:
                return (string) $var;

            case self::CAST_STRING_TRIM:
                return trim((string) $var);

            case self::CAST_DATETIME:
                $var = DateTimeImmutable::createFromFormat($format, $var);
                if ($var === false) {
                    throw new tasksException(sprintf('Wrong format %s for value %s', $format, $var));
                }

                return $var;
        }

        return $var;
    }

    /**
     * @return tasksApiResponseInterface
     */
    public function __invoke()
    {
        return $this->run();
    }
}
