<?php

try {
    waFiles::delete(wa()->getAppPath("plugins/export/templates/Link.html", 'tasks'));
} catch (waException $e) {
}
