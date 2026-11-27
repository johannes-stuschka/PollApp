-- PollApp: run once in Supabase → SQL Editor.

create table surveys (
  id bigint generated always as identity primary key,
  title text not null check (length(trim(title)) > 0),
  category text not null,
  description text,
  end_date date,
  -- [{ "text": "...", "allowMultiple": false, "answers": ["A", "B"] }]
  questions jsonb not null check (jsonb_typeof(questions) = 'array' and jsonb_array_length(questions) > 0),
  created_at timestamptz not null default now()
);

-- One row per chosen answer.
create table votes (
  id bigint generated always as identity primary key,
  survey_id bigint not null references surveys (id) on delete cascade,
  question_index int not null check (question_index >= 0),
  answer_index int not null check (answer_index between 0 and 5),
  created_at timestamptz not null default now()
);

create view vote_counts with (security_invoker = true) as
  select survey_id, question_index, answer_index, count(*)::int as votes
  from votes
  group by survey_id, question_index, answer_index;

-- Everyone may read and add surveys and votes, nobody may change or delete them.
alter table surveys enable row level security;
alter table votes enable row level security;
create policy "read surveys" on surveys for select to anon, authenticated using (true);
create policy "create surveys" on surveys for insert to anon, authenticated with check (true);
create policy "read votes" on votes for select to anon, authenticated using (true);
-- No votes for closed surveys.
create policy "vote on open surveys" on votes for insert to anon, authenticated with check (
  exists (
    select 1 from surveys s
    where s.id = survey_id and (s.end_date is null or s.end_date >= current_date)
  )
);
-- New Supabase projects don't grant table access to the API roles automatically.
grant select, insert on surveys, votes to anon, authenticated;
grant select on vote_counts to anon, authenticated;

-- Live updates for the app.
alter publication supabase_realtime add table surveys, votes;

-- Demo data: dates relative to today, so there are always open and closed surveys.
insert into surveys (title, category, description, end_date, questions) values
(
  'Let’s Plan the Next Team Event Together', 'Team Activities',
  'We want to create team activities that everyone will enjoy – share your preferences and ideas in our survey to help us plan better experiences together.',
  current_date + 1,
  '[{"text":"Which date would work best for you?","allowMultiple":true,"answers":["19.09.2025, Friday","10.10.2025, Friday","11.10.2025, Saturday","31.10.2025, Friday"]},
    {"text":"Choose the activities you prefer","allowMultiple":true,"answers":["Outdoor adventure like kayaking","Office Costume Party","Bowling, mini-golf, volleyball","Beach party, Music & cocktails","Escape room"]},
    {"text":"What’s most important to you in a team event?","allowMultiple":true,"answers":["Team bonding","Food and drinks","Trying something new","Keeping it low-key and stress-free"]},
    {"text":"How long would you prefer the event to last?","allowMultiple":false,"answers":["Half a day","Full day","Evening only"]}]'
),
(
  'Healthier future: Fit & wellness survey!', 'Health & Wellness', null, current_date + 2,
  '[{"text":"How often do you exercise per week?","allowMultiple":false,"answers":["Never","1–2 times","3–4 times","5 times or more"]}]'
),
(
  'Gaming habits and favorite games!', 'Gaming & Entertainment', null, current_date + 3,
  '[{"text":"Which genres do you play?","allowMultiple":true,"answers":["Strategy","Shooter","Puzzle","Sports"]}]'
),
(
  'Which workshop should we offer next?', 'Education & Learning', null, current_date + 14,
  '[{"text":"Pick a topic","allowMultiple":false,"answers":["Angular basics","Git & teamwork","UX design"]}]'
),
(
  'AI tools at work', 'Technology & Innovation', null, null,
  '[{"text":"Which AI tools do you use?","allowMultiple":true,"answers":["Chat assistants","Code assistants","Image generators","None"]}]'
),
(
  'Coffee or tea in the office?', 'Lifestyle & Preferences', null, current_date - 5,
  '[{"text":"What do you drink most?","allowMultiple":false,"answers":["Coffee","Tea","Water"]}]'
),
(
  'Summer party feedback', 'Team Activities', null, current_date - 20,
  '[{"text":"How did you like the summer party?","allowMultiple":false,"answers":["Loved it","It was okay","Not my thing"]}]'
);

-- Votes for the closed demo surveys (inserted here because the policy blocks closed surveys for the app).
insert into votes (survey_id, question_index, answer_index)
select s.id, 0, v.answer_index
from surveys s
cross join lateral (values (0), (0), (0), (0), (0), (1), (1), (1), (2)) as v (answer_index)
where s.title in ('Coffee or tea in the office?', 'Summer party feedback');
