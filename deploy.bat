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

    :Begin
        SET FLAG_BUMP=True
        SET FLAG_PUBLISH=True
        SHIFT
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
    :End
ENDLOCAL
