module.exports = function (grunt) {
    // https://www.npmjs.com/package/grunt-bump
    grunt.initConfig({
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: '@iatec/ng2-layout v%VERSION%',
                commitFiles: ['package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: '@iatec/ng2-layout v%VERSION% is done!',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: 'rc',
                metadata: '',
                regExp: false
            }
        },
    });
    grunt.loadNpmTasks('grunt-bump');
    grunt.registerTask('default', ['bump']);
};
