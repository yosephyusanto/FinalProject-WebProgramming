<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    @auth
    <meta name="user-id" content="{{ auth()->id() }}">
    @endauth
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
    @routes
    <title>Document</title>
</head>
<body>
     @inertia
</body>
</html>