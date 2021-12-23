<?php

class tasksApiTeammateContactInfoDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var string
     */
    private $name;

    /**
     * @var string|null
     */
    private $title;

    /**
     * @var string|null
     */
    private $firstname;

    /**
     * @var string|null
     */
    private $middlename;

    /**
     * @var string|null
     */
    private $lastname;

    /**
     * @var string|null
     */
    private $jobtitle;

    /**
     * @var string|null
     */
    private $company;

    /**
     * @var array<tasksApiEmailDto>
     */
    private $email;

    /**
     * @var array<tasksApiPhoneDto>
     */
    private $phone;

    /**
     * @var string|null
     */
    private $gender;

    /**
     * @var array<tasksApiImDto>
     */
    private $im;

    /**
     * @var array<tasksApiAddressDto>
     */
    private $address;

    /**
     * @var array<tasksApiUrlDto>
     */
    private $url;

    /**
     * @var string|null
     */
    private $birthday;

    /**
     * @var string|null
     */
    private $locale;

    /**
     * @var string|null
     */
    private $timezone;

    /**
     * @var array<tasksApiSocialnetworkDto>
     */
    private $socialnetwork;

    /**
     * @var string|null
     */
    private $about;

    /**
     * @var string
     */
    private $large_photo_url;

    public function __construct(
        string $name,
        ?string $title,
        ?string $firstname,
        ?string $middlename,
        ?string $lastname,
        ?string $jobtitle,
        ?string $company,
        array $email,
        array $phone,
        ?string $gender,
        array $im,
        array $address,
        array $url,
        ?string $birthday,
        ?string $locale,
        ?string $timezone,
        array $socialnetwork,
        ?string $about,
        string $largePhotoUrl
    ) {
        $this->name = $name;
        $this->title = $title;
        $this->firstname = $firstname;
        $this->middlename = $middlename;
        $this->lastname = $lastname;
        $this->jobtitle = $jobtitle;
        $this->company = $company;
        $this->email = $email;
        $this->phone = $phone;
        $this->gender = $gender;
        $this->im = $im;
        $this->address = $address;
        $this->url = $url;
        $this->birthday = $birthday;
        $this->locale = $locale;
        $this->timezone = $timezone;
        $this->socialnetwork = $socialnetwork;
        $this->about = $about;
        $this->large_photo_url = $largePhotoUrl;
    }
}
