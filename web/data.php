<?php
	if ($_REQUEST["action"] == "save") {
		$fileName = $_REQUEST["file"] == null ? "main.json" : $_REQUEST["file"];
		$postdata = file_get_contents("php://input");		// $HTTP_RAW_POST_DATA
		file_put_contents("schemas/".$fileName, $postdata);
		echo "данные успешно сохранены.";
	} else if ($_REQUEST["action"] == "load") {
		$fileName = $_REQUEST["file"] == null ? "main.json" : $_REQUEST["file"];
		echo file_get_contents("schemas/".$fileName);
	} else {
		echo "ошибка, неизвестный параметр.";
	}


?>