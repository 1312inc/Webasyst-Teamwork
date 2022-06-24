<?php

final class tasksApiContactDtoFactory
{
    /**
     * @var tasksApiContactDto[]
     */
    private static $contacts;

    public static function fromContactId(int $contactId): tasksApiContactDto
    {
        if (!isset(self::$contacts[$contactId])) {
            self::$contacts[$contactId] = self::fromContact(new waContact($contactId));
        }

        return self::$contacts[$contactId];
    }

    public static function fromContact(waContact $contact): tasksApiContactDto
    {
        $contactId = $contact->getId();
        if (!isset(self::$contacts[$contactId])) {
            self::$contacts[$contactId] = new tasksApiContactDto(
                (int) $contact->getId(),
                $contact->exists() ? $contact->getName() : _w('Deleted contact'),
                wa()->getConfig()->getHostUrl() . waContact::getPhotoUrl(
                    $contact->getId(),
                    $contact->exists() ? $contact->get('photo') : null,
                    96,
                    96,
                    'person',
                    true
                ),
                wa()->getUser()->getId() == $contact->getId()
            );
        }

        return self::$contacts[$contactId];
    }
}
