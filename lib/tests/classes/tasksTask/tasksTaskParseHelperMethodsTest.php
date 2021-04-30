<?php

require_once(realpath(dirname(__FILE__).'/../../../../').'/init.php');

class tasksTaskParseHelperMethodsTest extends PHPUnit_Framework_TestCase
{
    public function setUp()
    {
        wa('tasks');
    }

    public function testExtractTags()
    {
        $text = 'Субж

Нужно посмотреть #movie   о шпеонах

#one #two_2 #three-3

Родительская задача #2.100';
        $res = tasksTask::extractTags($text);
        $expected_tags = array(
            'movie',
            'one',
            'two_2',
            'three-3'
        );
        $this->assertEquals($expected_tags, $res);
    }

    public function textExtractTaskNumbers()
    {
        $text = 'Субж

Нужно посмотреть #movie   о шпеонах

#one #two_2 #three-3 #3.123

Родительская задача #2.100';
        $res = tasksTask::extractTaskNumbers($text);
        $expected = array(
            '3.123',
            '2.100'
        );
        $this->assertEquals($expected, $res);
    }

    public function testWrapTagsInLinks()
    {
        $text = 'Субж

Нужно посмотреть #movie   о шпеонах

#one #two_2 #three-3

Родительская задача #2.100';

        $res = tasksTask::wrapTagsInLinks($text, array(
            'url_pattern' => 'unit/test/{$tag}/',
            'link_pattern' => '<a href="{$url}" class="t-unit-test-tag">#{$tag}</a>'
        ));

        $text_expected = 'Субж

Нужно посмотреть <a href="unit/test/movie/" class="t-unit-test-tag">#movie</a>   о шпеонах

<a href="unit/test/one/" class="t-unit-test-tag">#one</a> <a href="unit/test/two_2/" class="t-unit-test-tag">#two_2</a> <a href="unit/test/three-3/" class="t-unit-test-tag">#three-3</a>

Родительская задача #2.100';

        $this->assertEquals($text_expected, $res);
    }

    public function testWrapTagsInLinksSkipOptions()
    {
        $text = 'Субж

Нужно посмотреть #movie   о шпеонах

#one #two_2 #three-3

Родительская задача #2.100';

        $res = tasksTask::wrapTagsInLinks($text);

        $text_expected = 'Субж

Нужно посмотреть <a href="#/tasks/tag/movie/" class="t-tag-link">#movie</a>   о шпеонах

<a href="#/tasks/tag/one/" class="t-tag-link">#one</a> <a href="#/tasks/tag/two_2/" class="t-tag-link">#two_2</a> <a href="#/tasks/tag/three-3/" class="t-tag-link">#three-3</a>

Родительская задача #2.100';

        $this->assertEquals($text_expected, $res);
    }

    public function testWrapTaskNumbersInLinks()
    {
        $text = 'Субж

Нужно посмотреть #movie   о шпеонах

#one #two_2 #three-3 #3.123

Родительская задача #2.100';

        $res = tasksTask::wrapTaskNumbersInLinks($text, array(
            'url_pattern' => 'unit/test/{$number}/',
            'link_pattern' => '<a href="{$url}" class="t-unit-test-number">#{$tag}</a>'
        ));

        $text_expected = 'Субж

Нужно посмотреть #movie   о шпеонах

#one #two_2 #three-3 <a href="unit/test/3.123/" class="t-unit-test-number">#3.123</a>

Родительская задача <a href="unit/test/2.100/" class="t-unit-test-number">#2.100</a>';

        $this->assertEquals($text_expected, $res);
    }

    public function testWrapTaskNumbersInLinksSkipOptions()
    {
        $text = 'Субж

Нужно посмотреть #movie   о шпеонах

#one #two_2 #three-3 #3.123

Родительская задача #2.100';

        $res = tasksTask::wrapTaskNumbersInLinks($text);

        $text_expected = 'Субж

Нужно посмотреть #movie   о шпеонах

#one #two_2 #three-3 <a href="#/task/3.123/" class="t-task-link">#3.123</a>

Родительская задача <a href="#/task/2.100/" class="t-task-link">#2.100</a>';

        $this->assertEquals($text_expected, $res);
    }

    public function testParseText()
    {
        $text = 'Субж

Нужно посмотреть #movie   о шпеонах

#one #two_2 #three-3

Родительская задача #2.100';

        $res = tasksTask::formatText($text);

        $text_expected = '<p>Субж</p>
<p>Нужно посмотреть <a href="#/tasks/tag/movie/" class="t-tag-link">#movie</a>   о шпеонах</p>
<p><a href="#/tasks/tag/one/" class="t-tag-link">#one</a> <a href="#/tasks/tag/two_2/" class="t-tag-link">#two_2</a> <a href="#/tasks/tag/three-3/" class="t-tag-link">#three-3</a></p>
<p>Родительская задача <a href="#/task/2.100/" class="t-task-link">#2.100</a></p>';

        $this->assertEquals($text_expected, $res);
    }

    public function testParseTextIgnoreMarkdown()
    {
        $text = 'Субж

Нужно посмотреть #movie   о шпеонах

#one #two_2 #three-3

Родительская задача #2.100';

        $res = tasksTask::formatText($text, array(
            'markdown' => false
        ));

        $text_expected = 'Субж

Нужно посмотреть <a href="#/tasks/tag/movie/" class="t-tag-link">#movie</a>   о шпеонах

<a href="#/tasks/tag/one/" class="t-tag-link">#one</a> <a href="#/tasks/tag/two_2/" class="t-tag-link">#two_2</a> <a href="#/tasks/tag/three-3/" class="t-tag-link">#three-3</a>

Родительская задача <a href="#/task/2.100/" class="t-task-link">#2.100</a>';

        $this->assertEquals($text_expected, $res);

    }

}
