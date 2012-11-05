<?php
	if ($_REQUEST["action"] == "save") {
		$fileName = $_REQUEST["file"] == null ? "main.json" : $_REQUEST["file"];
		$postdata = file_get_contents("php://input");		// $HTTP_RAW_POST_DATA

		if (basename($fileName) == $fileName) {
			file_put_contents("schemas/".$fileName, $postdata);
			echo "данные успешно сохранены.";
		} else {
			echo "ошибка имени файла";
		}

	} else if ($_REQUEST["action"] == "load") {
		$fileName = $_REQUEST["file"] == null ? "main.json" : $_REQUEST["file"];
		if (basename($fileName) == $fileName) {
			echo file_get_contents("schemas/".$fileName);
		} else {
			echo "";
		}
	} else {
		echo "ошибка, неизвестный параметр.";
	}


?>