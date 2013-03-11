rm -f -r ../jellyDeploy/src/
mkdir ../jellyDeploy/src/
cp -R src/shared ../jellyDeploy/src/
cp -R src/server ../jellyDeploy/src/
cp -R src/views ../jellyDeploy/src/

rm -f -r ../jellyDeploy/static/
cp -R static ../jellyDeploy/
cp -R build/ ../jellyDeploy/static/

cp -f Procfile package.json ../jellyDeploy/
