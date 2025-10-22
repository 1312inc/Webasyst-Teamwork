<?php
return array(
    'php' => array(
        'strict'  => true,
        'version' => '>=7.4',
    ),
    'app.installer' => array(
        'version' => '>=3.8.0', //don't use 'latest' as it may block installer.product.install API flow
        'strict' => true,
    ),
);
