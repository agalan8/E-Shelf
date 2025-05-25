<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tus productos digitales</title>
</head>
<body>
    <h1>Gracias por tu compra</h1>

    <p>Hola {{ $order->user->name }},</p>

    <p>Aquí tienes tus productos digitales para descargar:</p>

    <ul>
        @foreach($downloadLinks as $link)
            <li>
                <strong>{{ $link['title'] }}</strong>:
                <a href="{{ $link['url'] }}" download>Ver</a>
            </li>
        @endforeach
    </ul>

    <p>¡Disfrútalos!</p>
</body>
</html>
