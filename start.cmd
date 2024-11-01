@ECHO OFF 

FOR %%A IN (%*) DO (
    IF "%%A" == "-b" (
        ECHO Starting backend application...
        cd backend
        start /b python manage.py runserver 127.0.0.1:8000
        GOTO :eof
    )
    IF "%%A" == "-f" (
        ECHO Starting frontend application...
        cd frontend
        start /b npm run dev
        GOTO :eof
    )

    ECHO Invalid arguments!
)

ECHO No arguments were passed!

EXIT