# Django Visualisation

## Development
### Create Virtual Env / Init
```
python3 -m venv .venv
source .venv/bin/activate
```

```
pip install -r requirements.txt
python manage.py migrate
```

```
python manage.py createsuperuser
```

### Start Development Server
```
gcloud auth application-default login

python manage.py runserver
```

### Front End
```
cd react_project
npm install
npm run start
```