<?php

final class tasksTeammateStatusService
{
    /**
     * @return array<tasksTeammateStatusDto>
     * @throws waDbException
     */
    public function getAllForContact(waContact $contact, bool $force = false): array
    {
        $key = 'getAllForContact' . $contact->getId();
        $result = tsks()->getCache()->get($key);
        if (!$force && $result) {
            return $result;
        }

        $defaultStatus = $this->hasDefaultStatus() ? 'wcc.default_status' : 'wcc.name';

        $sql = <<<SQL
select if(isnull(wce.summary), {$defaultStatus}, wce.summary) name,
       wcc.id calendar_id,
       wcc.bg_color,
       wcc.font_color,
       datediff(wce.end, wce.start) days,
       wce.id status_id
from wa_contact_calendars wcc
         left join (
    select max(wce.id) last_wce_id ,wce.calendar_id
    from wa_contact_events wce
    where wce.is_status = 1
      and wce.contact_id = i:contact_id
      /*and wce.summary_type = 'custom'*/
    group by wce.calendar_id) last_wce on wcc.id = last_wce.calendar_id
         left join wa_contact_events wce on wce.id = last_wce.last_wce_id
SQL;

        $result = tsks()->getModel()
            ->query($sql, ['contact_id' => $contact->getId()])
            ->fetchAll();

        $statuses = [];
        foreach ($result as $item) {
            if (empty($item['name'])) {
                continue;
            }
            $statuses = new tasksTeammateStatusDto($item['name'], $item['bg_color'], $item['font_color']);
        }

        tsks()->getCache()->set($key, $statuses, 10);

        return $statuses;
    }

    public function getForContactId(
        $contactId,
        DateTimeInterface $date,
        bool $force = false
    ): ?tasksTeammateStatusDto {
        $key = 'getForContact' . $contactId . $date->format('Y-m-d');
        $result = tsks()->getCache()->get($key);
        if (!$force && $result) {
            return $result;
        }

        $defaultStatus = $this->hasDefaultStatus() ? 'wcc.default_status' : 'wcc.name';

        $sql = <<<SQL
select if(isnull(wce.summary), '{$defaultStatus}', wce.summary) name,
       wcc.id calendar_id,
       wcc.bg_color,
       wcc.font_color,
       datediff(wce.end, wce.start) days,
       wce.id status_id
from wa_contact_calendars wcc
         left join (
    select max(wce.id) last_wce_id ,wce.calendar_id
    from wa_contact_events wce
    where wce.is_status = 1
      and wce.contact_id = i:contact_id
      and ((wce.start between s:date1 and s:date2)
        or (wce.start < s:date3 and wce.end > s:date3))
      /*and wce.summary_type = 'custom'*/
    group by wce.calendar_id) last_wce on wcc.id = last_wce.calendar_id
         left join wa_contact_events wce on wce.id = last_wce.last_wce_id
where wce.is_status = 1
    and wce.contact_id = i:contact_id
    and ((wce.start between s:date1 and s:date2)
        or (wce.start < s:date3 and wce.end > s:date3))
order by wce.update_datetime DESC
limit 1
SQL;

        $result = tsks()->getModel()->query(
            $sql,
            [
                'contact_id' => $contactId,
                'date1' => $date->format('Y-m-d 00:00:00'),
                'date2' => $date->format('Y-m-d 23:59:59'),
                'date3' => $date->format('Y-m-d H:i:s'),
            ]
        )->fetchAll();

        if ($result) {
            $result = reset($result);
            $result = new tasksTeammateStatusDto($result['name'], $result['bg_color'], $result['font_color']);
        } else {
            $result = null;
        }

        tsks()->getCache()->set($key, $result, 30);

        return $result;
    }

    private function hasDefaultStatus(): bool
    {
        return tsks()->getModel('waContactCalendars')->fieldExists('default_status');
    }
}
