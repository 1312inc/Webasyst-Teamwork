<?php
/**
 * All backend and frontend requests to Tasks app are set up
 * (via lib/config/factories.php) to go through this controller.
 * It is responsible for the most general event hooks imaginable:
 * controller_before and controller_after.
 */
class tasksFrontController extends waFrontController
{
    protected function runController($controller, $params = null)
    {
        $class = get_class($controller);
        if ($class === 'waDefaultViewController' && $controller->getAction()) {
            $class = $controller->getAction();
            if (is_object($class)) {
                $class = get_class($class);
            }
        }
        $evt_params = array(
            'controller' => $controller,
            'params' => &$params,
        );
        $handled = wa('tasks')->event('controller_before.'.$class, $evt_params);
        if ($handled) {
            return;
        }
        $result = parent::runController($controller, $params);
        $evt_params = array(
            'controller' => $controller,
            'params' => $params,
            'result' => &$result,
        );
        wa('tasks')->event('controller_after.'.$class, $evt_params);
        return $result;
    }
}
