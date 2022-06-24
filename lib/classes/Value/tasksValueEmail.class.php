<?php

final class tasksValueEmail
{
    private $email;

    public function __construct(string $email)
    {
        if (!$email) {
            throw new tasksApiWrongParamException('email', 'Email is empty');
        }

        if (!(new waEmailValidator())->isValid($email)) {
            throw new tasksApiWrongParamException('email', 'Email is invalid');
        }
        $this->email = $email;
    }

    public function getValue(): string
    {
        return $this->email;
    }
}
