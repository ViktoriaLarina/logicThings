var gulp = require('gulp');
var sonarqubeScanner = require('sonarqube-scanner');

gulp.task('sonar', (callback) => {
  sonarqubeScanner({
    serverUrl : 'http://localhost:9000',
    options : {
    },
  }, callback);
});
