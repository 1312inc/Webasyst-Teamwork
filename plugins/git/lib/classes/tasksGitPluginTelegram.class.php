<?php

class tasksGitPluginTelegram
{
    const API_URL = "https://api.telegram.org/bot";

    protected $access_token;

    protected $chat_id;

    protected $options = array();

    public function __construct($access_token, $options = array())
    {
        $this->access_token = (string) $access_token;

        $this->options = (array) $options;
    }

    public function sendMessage($params)
    {
        $default_params = array(
            'parse_mode' => 'HTML',
        );
        $params = array_merge($default_params, $params);
        return $this->request('sendMessage', $params);
    }

    /**
     * @param $method
     * @param array $params
     * @return array
     * @throws waException
     */
    protected function request($method, $params = array()) {
        $token = $this->access_token;

        $url = self::API_URL.$token.'/'.$method;
        if (!empty($params)) {
            $url .= '?'.http_build_query($params);
        }

        try {
            return $this->getNet()->query($url);
        } catch (waException $e) {
            // If the first request was with a proxy, then try again without a proxy.
            if (!empty($this->options['proxy_options'])) {
                return $this->getNet(true)->query($url);
            }
        }
    }

    private function getNet($without_proxy = false)
    {
        static $net;

        if (!empty($without_proxy) || empty($net)) {
            $net_options = array();

            if (empty($without_proxy) && !empty($this->options['proxy_options'])) {
                $net_options = $this->options['proxy_options'];
            }
            if (!empty($this->options['timeout'])) {
                $net_options['timeout'] = $this->options['timeout'];
            }
            $net = new waNet($net_options);
        }

        return $net;
    }
}