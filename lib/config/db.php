<?php
return array(
    'tasks_attachment' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'task_id' => array('int', 11, 'null' => 0),
        'log_id' => array('int', 11),
        'create_datetime' => array('datetime', 'null' => 0),
        'contact_id' => array('int', 11, 'null' => 0),
        'name' => array('varchar', 255, 'null' => 0),
        'size' => array('int', 11, 'null' => 0),
        'ext' => array('varchar', 10, 'null' => 0),
        'code' => array('varchar', 16, 'null' => 0),
        ':keys' => array(
            'PRIMARY' => 'id',
        ),
        ':options' => array('charset' => 'utf8mb4'),
    ),
    'tasks_favorite' => array(
        'contact_id' => array('int', 11, 'null' => 0),
        'task_id' => array('int', 11, 'null' => 0),
        'unread' => array('tinyint', 4, 'null' => 0, 'default' => '0'),
        ':keys' => array(
            'PRIMARY' => array('contact_id', 'task_id'),
            'contact_unread' => array('contact_id', 'unread'),
        ),
    ),
    'tasks_field' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'name' => array('varchar', 64, 'null' => 0),
        'control' => array('varchar', 64, 'null' => 0),
        'sort' => array('int', 11, 'null' => 0, 'default' => '0'),
        'data' => array('text'),
        ':keys' => array(
            'PRIMARY' => 'id',
        ),
    ),
    'tasks_field_data' => array(
        'task_id' => array('int', 11, 'null' => 0),
        'field_id' => array('int', 11, 'null' => 0),
        'value' => array('text'),
        ':keys' => array(
            'PRIMARY' => array('task_id', 'field_id')
        )
    ),
    'tasks_list' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'create_datetime' => array('datetime', 'null' => 0),
        'contact_id' => array('int', 11, 'null' => 0),
        'name' => array('varchar', 255, 'null' => 0),
        'hash' => array('varchar', 255, 'null' => 0),
        'params' => array('text'),
        'order' => array('varchar', 32),
        'icon' => array('varchar', 255, 'null' => 0, 'default' => ''),
        'count' => array('int', 11, 'null' => 0, 'default' => '0'),
        ':keys' => array(
            'PRIMARY' => 'id',
            'contact_id' => 'contact_id',
        ),
        ':options' => array('charset' => 'utf8mb4'),
    ),
    'tasks_milestone' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'name' => array('varchar', 255, 'null' => 0),
        'description' => array('text'),
        'project_id' => array('int', 11, 'null' => 0),
        'parent_scope_id' => array('int', 'default' => null),
        'due_date' => array('date'),
        'start_date' => array('date'),
        'end_date' => array('date'),
        'closed' => array('int', 1, 'null' => 0, 'default' => '0'),
        ':keys' => array(
            'PRIMARY' => 'id',
        ),
        ':options' => array('charset' => 'utf8mb4'),
    ),
    'tasks_milestone_ext' => array(
        'status_id' => array('int', 11, 'null' => 0),
        'milestone_id' => array('int', 11, 'null' => 0),
        'limit' => array('int', 11),
        ':keys' => array(
            'PRIMARY' => array('status_id', 'milestone_id')
        ),
    ),
    'tasks_milestone_projects' => array(
        'milestone_id' => array('int', 11, 'null' => 0),
        'project_id' => array('int', 11, 'null' => 0),
        ':keys' => array(
            'PRIMARY' => array('milestone_id', 'project_id')
        )
    ),
    'tasks_project' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'name' => array('varchar', 255, 'null' => 0),
        'contact_id' => array('int', 11, 'null' => 0),
        'create_datetime' => array('datetime', 'null' => 0),
        'tasks_number' => array('int', 11, 'null' => 0, 'default' => '0'),
        'icon' => array('varchar', 255, 'null' => 0, 'default' => ''),
        'color' => array('varchar', 50, 'null' => 0, 'default' => ''),
        'archive_datetime' => array('datetime'),
        'sort' => array('int', 11, 'null' => 0, 'default' => '0'),
        ':keys' => array(
            'PRIMARY' => 'id',
        ),
        ':options' => array('charset' => 'utf8mb4'),
    ),
    'tasks_project_status_params' => array(
        'project_id' => array('int', 11, 'null' => 0),
        'status_id' => array('int', 11, 'null' => 0),
        'name' => array('varchar', 248, 'null' => 0),
        'value' => array('text', 'null' => 0),
        ':keys' => array(
            'PRIMARY' => array('project_id', 'status_id', 'name'),
        ),
        ':options' => array('charset' => 'utf8mb4'),
    ),
    'tasks_project_statuses' => array(
        'project_id' => array('int', 11, 'null' => 0),
        'status_id' => array('int', 11, 'null' => 0),
        ':keys' => array(
            'PRIMARY' => array('project_id', 'status_id'),
        ),
    ),
    'tasks_push_client' => array(
        'client_id' => array('varchar', 255, 'null' => 0),
        'contact_id' => array('int', 11, 'null' => 0),
        'api_token' => array('varchar', 32),
        'create_datetime' => array('datetime', 'null' => 0),
        ':keys' => array(
            'PRIMARY' => 'client_id',
            'tasks_push_client_client_id_uindex' => array('client_id', 'unique' => 1),
            'tasks_push_client_contact_id_index' => 'contact_id',
        ),
    ),
    'tasks_status' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'name' => array('varchar', 255, 'null' => 0),
        'button' => array('varchar', 255, 'null' => 0),
        'sort' => array('int', 11, 'null' => 0),
        'icon' => array('varchar', 255, 'null' => 0, 'default' => ''),
        ':keys' => array(
            'PRIMARY' => 'id',
        ),
        ':options' => array('charset' => 'utf8mb4'),
    ),
    'tasks_status_params' => array(
        'status_id' => array('int', 11, 'null' => 0),
        'name' => array('varchar', 248, 'null' => 0),
        'value' => array('text', 'null' => 0),
        ':keys' => array(
            'PRIMARY' => array('status_id', 'name'),
        ),
        ':options' => array('charset' => 'utf8mb4'),
    ),
    'tasks_tag' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'name' => array('varchar', 249, 'null' => 0),
        'favorite' => array('tinyint', 4, 'null' => 0, 'default' => '0'),
        ':keys' => array(
            'PRIMARY' => 'id',
            'name' => array('name', 'unique' => 1),
        ),
        ':options' => array('charset' => 'utf8mb4'),
    ),
    'tasks_task' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'name' => array('varchar', 248, 'null' => 0),
        'text' => array('mediumtext', 'null' => 0),
        'create_contact_id' => array('int', 11, 'null' => 0),
        'create_datetime' => array('datetime', 'null' => 0),
        'update_datetime' => array('datetime', 'null' => 0),
        'assigned_contact_id' => array('int', 11),
        'project_id' => array('int', 11, 'null' => 0),
        'milestone_id' => array('int', 11),
        'number' => array('int', 11, 'null' => 0),
        'status_id' => array('int', 11, 'null' => 0, 'default' => '0'),
        'parent_id' => array('int', 11),
        'priority' => array('tinyint', 1, 'null' => 0, 'default' => '0'),
        'assign_log_id' => array('int', 11),
        'contact_id' => array('int', 11),
        'hidden_timestamp' => array('bigint', 20, 'null' => 0, 'default' => '0'),
        'due_date' => array('date'),
        'comment_log_id' => array('int', 11),
        'uuid' => array('varchar', 36),
        'public_hash' => array('varchar', 36),
        ':keys' => array(
            'PRIMARY' => 'id',
            'project_number' => array('project_id', 'number', 'unique' => 1),
            'tasks_task_public_hash_uindex' => array('public_hash', 'unique' => 1),
            'milestone_id' => 'milestone_id',
            'status_id' => 'status_id',
            'assigned_contact_id' => 'assigned_contact_id',
            'name_text' => array('name', 'text', 'fulltext' => 1),
        ),
        ':options' => array('charset' => 'utf8mb4'),
    ),
    'tasks_task_ext' => array(
        'task_id' => array('int', 11, 'null' => 0),
        'type' => array('varchar', 32),
        'gravity' => array('varchar', 32),
        'timecosts_plan' => array('int', 11),
        'timecosts_fact' => array('int', 11),
        'affected_version' => array('varchar', 32),
        'resolution' => array('varchar', 32),
        'kanban_color' => array('varchar', 50),
        ':keys' => array(
            'PRIMARY' => 'task_id',
            'type' => 'type',
            'gravity' => 'gravity',
            'resolution' => 'resolution'
        ),
    ),
    'tasks_task_log' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'project_id' => array('int', 11, 'null' => 0),
        'task_id' => array('int', 11, 'null' => 0),
        'contact_id' => array('int', 11, 'null' => 0),
        'text' => array('text', 'null' => 0),
        'create_datetime' => array('datetime', 'null' => 0),
        'before_status_id' => array('int', 11),
        'after_status_id' => array('int', 11, 'null' => 0),
        'action' => array('varchar', 255),
        'assigned_contact_id' => array('int', 11),
        ':keys' => array(
            'PRIMARY' => 'id',
            'task_id' => 'task_id',
            'tasks_task_log_contact_id_assigned_contact_id_index' => array('contact_id', 'assigned_contact_id'),
        ),
        ':options' => array('charset' => 'utf8mb4'),
    ),
    'tasks_task_log_params' => array(
        'task_id' => array('int', 11, 'null' => 0),
        'log_id' => array('int', 11, 'null' => 0),
        'name' => array('varchar', 249, 'null' => 0),
        'value' => array('text', 'null' => 0),
        ':keys' => array(
            'PRIMARY' => array('log_id', 'name'),
            'task_id' => 'task_id',
            'name' => 'name',
        ),
        ':options' => array('charset' => 'utf8mb4'),
    ),
    'tasks_task_relations' => array(
        'parent_id' => array('int', 11, 'null' => 0),
        'child_id' => array('int', 11, 'null' => 0),
        ':keys' => array(
            'PRIMARY' => array('parent_id', 'child_id'),
        ),
    ),
    'tasks_task_tags' => array(
        'tag_id' => array('int', 11, 'null' => 0),
        'task_id' => array('int', 11, 'null' => 0),
        ':keys' => array(
            'PRIMARY' => array('task_id', 'tag_id'),
            'tag_id' => 'tag_id',
        ),
    ),
    'tasks_task_types' => array(
        'id' => array('varchar', 32, 'null' => 0),
        'name' => array('varchar', 32, 'null' => 0),
        'color' => array('varchar', 64),
        'sort' => array('int', 11, 'null' => 0, 'default' => '0'),
        ':keys' => array(
            'PRIMARY' => 'id'
        )
    ),
    'tasks_type_fields' => array(
        'type_id' => array('varchar', 32, 'null' => 0),
        'field_id' => array('int', 11, 'null' => 0),
    ),
);
