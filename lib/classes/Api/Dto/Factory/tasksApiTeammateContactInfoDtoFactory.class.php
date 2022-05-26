<?php

final class tasksApiTeammateContactInfoDtoFactory
{
    public static function createFromContact(waContact $contact): tasksApiTeammateContactInfoDto
    {
        $contactFields = waContactFields::getInfo('person', true);
        $fieldValues = $contact->load('js', true);

        // Normalize field values
        foreach ($contactFields as $field_info) {
            if ($field_info instanceof waContactField) {
                $field_info = $field_info->getInfo();
            }

            if ($field_info['multi'] && isset($fieldValues[$field_info['id']])) {
                $fieldValues[$field_info['id']] = array_values($fieldValues[$field_info['id']]);
            }
        }

        $birthday = null;
        if (isset($fieldValues['birthday']['data'])) {
            $birthday = DateTimeImmutable::createFromFormat(
                'Y-n-j',
                sprintf(
                    '%s-%s-%s',
                    $fieldValues['birthday']['data']['year'],
                    $fieldValues['birthday']['data']['month'],
                    $fieldValues['birthday']['data']['day']
                )
            );

            if ($birthday) {
                $birthday = $birthday->format('Y-m-d');
            } else {
                $birthday = null;
            }
        }

        $adr = waContactFields::get('address');

        $address = array_map(function ($addr) use ($adr) {
            return ['ext' => $addr['ext'], 'value' => $adr->format(['data' => $addr['data']], 'value')];
        }, $fieldValues['address'] ?? []);

        return new tasksApiTeammateContactInfoDto(
            $fieldValues['name'],
            $fieldValues['title'] ?: null,
            $fieldValues['firstname'] ?: null,
            $fieldValues['middlename'] ?: null,
            $fieldValues['lastname'] ?: null,
            $fieldValues['jobtitle'] ?: null,
            $fieldValues['company'] ?: null,
            tasksApiEmailDto::createCollectionFromArray($fieldValues['email'] ?? []),
            tasksApiPhoneDto::createCollectionFromArray($fieldValues['phone'] ?? []),
            $fieldValues['sex'] ?: null,
            tasksApiImDto::createCollectionFromArray($fieldValues['im'] ?? []),
            $address,
            tasksApiUrlDto::createCollectionFromArray($fieldValues['url'] ?? []),
            $birthday,
            $fieldValues['locale'] ?: null,
            $fieldValues['timezone'] ?: null,
            tasksApiSocialnetworkDto::createCollectionFromArray($fieldValues['socialnetwork'] ?? []),
            $fieldValues['about'] ?: null,
            wa()->getConfig()->getHostUrl() . waContact::getPhotoUrl(
                $contact->getId(),
                $contact->exists() ? $contact->get('photo') : null,
                tasksOptions::getApiLargePhotoSize(),
                tasksOptions::getApiLargePhotoSize(),
                'person',
                true
            )
        );
    }
}
