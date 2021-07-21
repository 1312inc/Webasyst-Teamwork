<?php

try {
    waFiles::delete(wa()->getAppPath("plugins/preview/templates/Link.html", 'tasks'));
} catch (waException $e) {
}
