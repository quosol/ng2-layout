@ECHO off

SETLOCAL
    ECHO.
    ECHO **************************************************************************
    ECHO **************************************************************************
    ECHO *************------------------------------------------------*************
    ECHO *************                                                *************
    ECHO ************* AADS - Adventist Automated Deployment Services *************
    ECHO *************                                                *************
    ECHO *************------------------------------------------------*************
    ECHO **************************************************************************
    ECHO **************************************************************************
    ECHO.
    ECHO INFO:. AADS is running!
    ECHO.

    :ParseArgs
    IF NOT [%1] == [] (
        IF [%1] == [--bump] (
            SET FLAG_BUMP=True
            SET BUMPPARAMS=%2
            SHIFT
        )
        IF [%1] == [--bump-only] (
            SET FLAG_BUMP=True
            SET FLAG_BUMP_ONLY=True
            SET BUMPPARAMS=%2
            SHIFT
        )
        IF [%1] == [--build] (
            SET FLAG_BUILD=True
            SHIFT
        )
        IF [%1] == [--build-only] (
            SET FLAG_BUILD=True
            SET FLAG_BUILD_ONLY=True
            SHIFT
        )
        IF [%1] == [--publish-only] (
            SET FLAG_PUBLISH=True
            SET FLAG_PUBLISH_ONLY=True
            SHIFT
        )
        SHIFT
        GOTO :ParseArgs
    ) ELSE (
        IF [%0] == [] (
            SET BUMPPARAMS=%0
        )
        SET FLAG_BUMP=True
        SET FLAG_BUILD=True
        SET FLAG_PUBLISH=True
        SHIFT
    )
    ECHO.

    :Bump
        IF NOT DEFINED FLAG_BUMP GOTO :EndBump

        ECHO.
        ECHO *****************************************************************************************************************************
        IF [%BUMPPARAMS%] == [] (
            SET /p BUMPPARAMS=QUESTION:. Please, type how you want to bump:
        )
        ECHO INFO:. Showing what is gonna happen bumping with the command: '%BUMPPARAMS%'...
        CALL grunt bump:%BUMPPARAMS% --dry-run
        choice /c YN /N /M "QUESTION:. Are you sure you want to bump version of this project as it is? (y/N)"
        IF NOT %errorlevel%==1 GOTO :EndBump
        ECHO INFO:. Bumping a new version of project...
        CALL grunt bump:%BUMPPARAMS%
        ECHO INFO:. The new version of project is done!
        PAUSE
        ECHO *****************************************************************************************************************************
        ECHO.

        IF DEFINED FLAG_BUMP_ONLY GOTO :End
    :EndBump

    :Build
        IF NOT DEFINED FLAG_BUILD GOTO :EndBuild

        ECHO.
        ECHO *****************************************************************************************************************************
        choice /c YN /N /M "QUESTION:. Are you sure you want to build this project as it is? (y/N)"
        IF NOT %errorlevel%==1 GOTO :EndBuild
        ECHO INFO:. Building your project properly...
        CALL node --max_old_space_size=5120 "node_modules\@angular\cli\bin\ng" build --prod --build-optimizer
        ECHO INFO:. Build is completed, please check 'dist' folder!
        PAUSE
        ECHO *****************************************************************************************************************************
        ECHO.

        IF DEFINED FLAG_BUILD_ONLY GOTO :End
    :EndBuild

    :Publish
        IF NOT DEFINED FLAG_PUBLISH GOTO :EndBuild

        ECHO.
        ECHO *****************************************************************************************************************************
        choice /c YN /N /M "QUESTION:. Do you want to publish this project now? (y/N)"
        IF NOT %errorlevel%==1 GOTO :End
        ECHO INFO:. Publishing this package into NPM Repositories...
        ECHO.

        CALL npm publish

        ECHO INFO:. AADS is finishing!
        ECHO.
        ECHO **************************************************************************
        ECHO **************************************************************************
        ECHO *************------------------------------------------------*************
        ECHO *************                                                *************
        ECHO ************* AADS - Adventist Automated Deployment Services *************
        ECHO *************                                                *************
        ECHO *************------------------------------------------------*************
        ECHO **************************************************************************
        ECHO **************************************************************************
        ECHO.
    :EndPublish

    GOTO :End
ENDLOCAL
