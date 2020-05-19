import io

def Replace():
    version = 0
    with io.open('game.ver', "r", encoding='utf8') as file_handle:
        version = int(file_handle.readline())
    version += 1

    with io.open('game.ver', "w", encoding='utf8') as file_handle:
        file_handle.write(str(version))

    html = ""
    with io.open('./nginx/public/index.html', "r", encoding='utf8') as file_handle:
        html = str(file_handle.readline())

    html = html.replace('.png"', '.png?version=1.0.' + str(version) + '"')
    html = html.replace('.css"', '.css?version=1.0.' + str(version) + '"')
    html = html.replace('.js"', '.js?version=1.0.' + str(version) + '"')

    with io.open('./nginx/public/index.html', "w", encoding='utf8') as file_handle:
        file_handle.write(html)

Replace()