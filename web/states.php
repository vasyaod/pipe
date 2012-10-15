<?php
	session_start();
	if (!isset($_SESSION['state'])) {
	    $_SESSION['state'] = (object)array();
		$state = $_SESSION['state'];
		$state->version = 1;
		$state->p1 = "pipe-gas-right";
		$state->p2 = "pipe-gas-right";
		$state->p3 = "pipe-gas-right";
		$state->p4 = "pipe-gas-right";
		$state->f1 = "open";
		$state->f2 = "open";
		$state->f3 = "open";
	} else {
		$state = $_SESSION['state'];
	}
	
	if ($_REQUEST["action"] == "clear") {
		unset($_SESSION['state']);
		return;
	}

	if ($_REQUEST["action"] == "toggle") {
		if ($_REQUEST["partId"] == "f2" && $state->f2 == "open")
			$state->f2 = "close";
		else if ($_REQUEST["partId"] == "f2" && $state->f2 == "close")
			$state->f2 = "open";
		else if ($_REQUEST["partId"] == "f3" && $state->f3 == "open")
			$state->f3 = "close";
		else if ($_REQUEST["partId"] == "f3" && $state->f3 == "close")
			$state->f3 = "open";

		if ($state->f2 == "close" && $state->f3 == "close") {
			$state->f1 = "close";
			$state->p1 = "pipe-gas-full";
			$state->p2 = "pipe-gas-full";
		} else {
			$state->f1 = "open";
			$state->p1 = "pipe-gas-right";
			$state->p2 = "pipe-gas-right";
		}
		if ($state->f2 == "close")
			$state->p3 = "pipe-gas-full";
		else
			$state->p3 = "pipe-gas-right";

		if ($state->f3 == "close")
			$state->p4 = "pipe-gas-full";
		else
			$state->p4 = "pipe-gas-right";

		$state->version++;
	}

	echo json_encode($state)."\n";
?>