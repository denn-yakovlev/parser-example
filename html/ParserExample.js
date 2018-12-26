
// Путь до файла с библиотекой элементов

var path = "/opers_keywords_list.json";

$(document).ready(function () {
    $("#btn").click(function () {

        var code = $("#code").val();
        var lang = document.getElementById("lang");
        var selLangIndex = lang.selectedIndex
        var selectedLang = lang.options[selLangIndex].value;

        // Убираем комменты

        var singleCommentRegex;
        var multiCommentRegex;

        switch (selectedLang) {
            case "Python":
                //
                break;
            case "Pascal":
                //
                break;
            case "PHP":
                //
                break;
            default:
                singleCommentRegex = /\/\/.*/g;
                multiCommentRegex = /\/\*(?:.|\n)*\*\//g;
                break;
        }

        code = code.replace(singleCommentRegex, "").replace(multiCommentRegex, "");

        var opersKwsListObj;

        var ajaxResponse = $.ajax({
            url: path,
            datatype: "jsonp"
        })
            .done(function () {

                opersKwsListObj = ajaxResponse.responseJSON;
                var forbidElems = $("#forbid_elems").val();


                // Запрещенные элементы можно вводить через ; или , или пробел в любой комбинации.
                // Для выделения элементов из строки сначала обрезаем их
                // с начала и конца (если есть), затем разделяем строку по ним


                forbidElems = forbidElems.replace(/(?:^[;, ]*)|(?:[;, ]*$)/g, "")
                    .split(/[;, ]+/g);

                // Проверяем наличие всех запрещенных элементов в библиотеке з.э.
                // данного языка


                var opersLib = opersKwsListObj.opersKwsList[selLangIndex].opers;
                var kwsLib = opersKwsListObj.opersKwsList[selLangIndex].keywords;

                for (let elem of forbidElems) {

                    if (opersLib.indexOf(elem) == -1 && kwsLib.indexOf(elem) == -1) {
                        alert(`Ошибка: элемента ${elem} не существует в языке ${selectedLang}`);
                        return;
                    }
                }

                // Ищем их в коде

                var regex;
                var found = [];
                for (let elem of forbidElems) {

                    // если просматриваемый элемент -- ключ.слово, а не оператор
                    // (если первый символ -- буква или # (C/C++), то это ключ.слово)

                    if (/\w|#/.test(elem[0])) {
                        regex = new RegExp("\\b" + elem + "\\b", "g");
                    }

                    // иначе это оператор

                    else {

                        // если в операторе есть символы 
                        // "+", "*", "/", ".", "^", "?", "(", ")", "$" -- экранируем их 

                        elemSlash = elem.replace(/([+*\/.^?()$])/g, `\\$1`);
                        regex = new RegExp(`(?<=['"\\w\\s])` + elemSlash + `(?=['";\\w\\s\\n])`, "g");
                    }

                    if (regex.test(code)) {
                        found.push(elem);
                    }
                }

                found = found.join('\n');

                if (found) {
                    alert(`В коде есть запрещенные элементы: \n${found}`);
                }

            })

            .fail( function() {
                alert ("Не удалось запросить файл с библиотекой элементов");
                return;
            })
    })
})