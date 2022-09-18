<?php
return array(
    'php' => array(
        'strict'  => true,
        'version' => '>=7.2',
    ),
    'app.installer' => array(
        'version' => '>=2.6.0', //don't use 'latest' as it may block installer.product.install API flow
        'strict' => true,
    ),
);
