Анимация трубопровода
=====================

Работа, выполненная в рамках тестового задания для конторы - [Камазнак](http://www.kamaznak.ru/uslugi/maketi).
В перспективе на её основе должен быть разработан интерактивный тренажер 
для предприятий нефте-газовой промышленности, но, по какой-то причине она 
не устроила заказчиков и дальнейшего развития не получила.

Смысл программы в следующем: обучающийся не тренажере сотрудник может открывать 
различные клапаны, краны и вентили, при этом он видит аниммированное движение 
газа в трубах и аварийные ситуации. 

Тренажер состоит из двух частей:
 * программа для расчета состояний;
 * программа для анимации состояний.

Вторую программу было решено сделать на HTML5+JS+jQuery+JAVA+GWT (или ExtJS). 
Она должна была работать по простому принципу - браузер периодически 
запрашивает состояние системы с сервера и отображает его.

За небольшой промежуток времени (5 дней) был написан:
 * http://pipe.difur.ru/index.html - анимматор;
 * http://pipe.difur.ru/editor.html и редактор.

Сайт проекта: http://pipe.difur.ru
Автор: vasyaod (vasyaod@mail.ru)