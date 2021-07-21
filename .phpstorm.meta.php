<?php

namespace PHPSTORM_META {

    override(
        \tasksConfig::getEntityFactory(),
        map(
            [
                '' => '@Factory',
            ]
        )
    );
    override(
        \tasksConfig::getModel(),
        map(
            [
                '' => '@Model',
            ]
        )
    );
    override(
        \tasksConfig::getEntityRepository(),
        map(
            [
                '' => '@Repository',
            ]
        )
    );
}
