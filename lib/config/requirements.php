<?php
return array(
    'php' => array(
        'strict'  => true,
        'version' => '>=8.2',
    ),
    'app.installer' => array(
        'version' => '>=4.0.0', //don't use 'latest' as it may block installer.product.install API flow
        'strict' => true,
    ),
);
