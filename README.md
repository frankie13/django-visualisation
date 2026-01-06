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


## Deploy to GCP Run
### Back End
```
docker build -t django-backend .

docker tag django-backend \
europe-west1-docker.pkg.dev/lab-workflow-ex/django-react-repo/django-backend

docker push \
europe-west1-docker.pkg.dev/lab-workflow-ex/django-react-repo/django-backend

gcloud run deploy django-backend \
  --image europe-west1-docker.pkg.dev/lab-workflow-ex/django-react-repo/django-backend \
  --platform managed \
  --allow-unauthenticated \
  --region europe-west1 \
  --port 8080

```

### Front End
```
docker build -t react-frontend .

docker tag react-frontend \
europe-west1-docker.pkg.dev/lab-workflow-ex/django-react-repo/react-frontend

docker push \
europe-west1-docker.pkg.dev/lab-workflow-ex/django-react-repo/react-frontend

gcloud run deploy react-frontend \
  --image europe-west1-docker.pkg.dev/lab-workflow-ex/django-react-repo/react-frontend \
  --platform managed \
  --allow-unauthenticated \
  --region europe-west1 \
  --port 8080


```