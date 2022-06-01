<?php

final class tasksValuePhone
{
    private $phone;

    public function __construct(string $phone)
    {
        if (!$phone) {
            throw new tasksApiWrongParamException('phone', 'Phone is empty');
        }

        if (!(new waPhoneNumberValidator())->isValid($phone)) {
            throw new tasksApiWrongParamException('phone', 'Phone is invalid');
        }
        $this->phone = $phone;
    }

    public function getValue(): string
    {
        return $this->phone;
    }
}
