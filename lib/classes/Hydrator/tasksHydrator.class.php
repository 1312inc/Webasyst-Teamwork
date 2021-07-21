<?php

/**
 * Class tasksHydrator
 */
final class tasksHydrator implements tasksHydratorInterface
{
    /**
     * @var array
     */
    private $reflectionClassMap = [];

    /**
     * @var array
     */
    private $fieldMethodMap = [];

    /**
     * @param tasksHydratableInterface $object
     * @param array                    $fields
     * @param array                    $dbFields
     *
     * @return array|mixed
     * @throws ReflectionException
     */
    public function extract(tasksHydratableInterface $object, array $fields = [], $dbFields = []): array
    {
        $result = [];

        $reflection = $this->getReflectionClass(get_class($object));
        $objectFields = $reflection->getProperties();

        $sqlValues = $object->convertToSqlValues($fields);

        foreach ($objectFields as $name) {
            $toExtractField = $name->getName();

            if ($fields && !in_array($toExtractField, $fields, true)) {
                continue;
            }

            if ($dbFields && !isset($dbFields[$toExtractField])) {
                continue;
            }

            if (isset($sqlValues[$toExtractField])) {
                $result[$toExtractField] = $sqlValues[$toExtractField];
            } else {
                foreach (['get', 'is'] as $methodPrefix) {
                    $method = $this->getMethod($object, $methodPrefix, $toExtractField, $reflection);
                    if ($method) {
                        $result[$toExtractField] = $method->invoke($object);
                        break;
                    }
                }
            }
        }

        return $result;
    }

    /**
     * @param tasksHydratableInterface $object
     * @param array                    $data
     *
     * @return tasksHydratableInterface
     * @throws ReflectionException
     */
    public function hydrate(tasksHydratableInterface $object, array $data): tasksHydratableInterface
    {
        $reflection = $this->getReflectionClass($object);

        $setDataFieldMethod = $this->getMethod($object, 'set', 'dataField', $reflection);

        $object->convertToPhpValues($data);

        foreach ($data as $name => $value) {
            $method = $this->getMethod($object, 'set', $name, $reflection);
            if ($method) {
                $method->invoke($object, $value);
            } elseif ($setDataFieldMethod) {
                $setDataFieldMethod->invoke($object, $name, $value);
            }
        }

        return $object;
    }


    /**
     * @param string|object $target
     *
     * @return ReflectionClass
     * @throws ReflectionException
     */
    private function getReflectionClass($target): ReflectionClass
    {
        $className = is_object($target) ? get_class($target) : $target;
        if (!isset($this->reflectionClassMap[$className])) {
            $this->reflectionClassMap[$className] = new ReflectionClass($className);
        }

        return $this->reflectionClassMap[$className];
    }

    /**
     * @param object|string   $target
     * @param string          $prefix
     * @param string          $name
     * @param ReflectionClass $reflection
     *
     * @return ReflectionMethod|false
     */
    private function getMethod($target, string $prefix, string $name, ReflectionClass $reflection)
    {
        $className = is_object($target) ? get_class($target) : $target;

        if (!isset($this->fieldMethodMap[$className][$prefix][$name])) {
            $methodName = $prefix . str_replace('_', '', ucwords($name, '_'));
            $this->fieldMethodMap[$className][$prefix][$name] = false;
            try {
                if ($reflection->hasMethod($methodName)) {
                    $method = $reflection->getMethod($methodName);

                    if ($method->isPublic()) {
                        $this->fieldMethodMap[$className][$prefix][$name] = $method;
                    }
                }
            } catch (ReflectionException $ex) {
            }
        }

        return $this->fieldMethodMap[$className][$prefix][$name];
    }
}