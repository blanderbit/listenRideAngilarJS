List-n-Ride Frontend
===============

Staging: [`http://en.staging.listnride.com/`](http://en.staging.listnride.com/)
Production: [`http://en.listnride.com/`](http://en.listnride.com/)

Prerequisites
-------------
Required software: `angular`, `npm`

Install
-----------------
```
git clone https://github.com/listnride/listnride-frontend.git && cd listnride-frontend
cd listnride
npm install
```

Launch
------------
```
npm start
```
Or if you don't need console output
```
npm start -quite
```
Navigate to [http://localhost:8080/#/](http://localhost:8080/#/)


Branching guide
------------- 
All new branches must use `dev` as a base branch
Name your branches as: 'FL-name-of-some-feature', where FL - your initials

Before create new PR: 
Ensure that your branch has latest changes from `dev`. You can update it using, for example `git rebase`
