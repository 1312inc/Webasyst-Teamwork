<?php

return array (
    '' => 'frontend/',
    'task/<public_hash:[a-zA-Z0-9_-]+>/?' => 'frontend/taskPublic',
    'milestone/<public_hash:[a-zA-Z0-9_-]+>/?' => 'frontend/milestonePublic',
    'project/<public_hash:[a-zA-Z0-9_-]+>/?' => 'frontend/projectPublic',
);
