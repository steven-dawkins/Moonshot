docker build . --tag moonshot
docker tag moonshot eu.gcr.io/moonshot-813/moonshot
docker push eu.gcr.io/moonshot-813/moonshot