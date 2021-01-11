CREATE TABLE model_check_item(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	model_id VARCHAR(32) NOT NULL,
	name VARCHAR(64) NOT NULL,
	FOREIGN KEY (model_id) REFERENCES model(id)
);

CREATE TABLE sale_model_check_item(
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		sale_id INT NOT NULL,
		model_check_item_id INT NOT NULL,
		checked BOOLEAN NOT NULL DEFAULT 0,
		remarks VARCHAR(64) NOT NULL,
		added_user_id INT NOT NULL,
		FOREIGN KEY (sale_id) REFERENCES sale(id),
		FOREIGN KEY (model_check_item_id) REFERENCES model_check_item(id),
		FOREIGN KEY (added_user_id) REFERENCES user(id)
	);