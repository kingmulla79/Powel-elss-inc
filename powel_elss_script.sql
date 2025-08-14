DROP DATABASE IF EXISTS powel_elss_inc;
CREATE DATABASE powel_elss_inc;

USE powel_elss_inc;

SHOW TABLES;

CREATE TABLE department (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO department (dept_name) VALUES ("Administration"), ("Finance");

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    email VARCHAR(70) UNIQUE NOT NULL,
    user_password VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    avatar_public_id VARCHAR(100) NULL,
    avatar_url VARCHAR(100) NULL,
    user_role VARCHAR(20) DEFAULT "system_admin",
    dept_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES department(dept_id) ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE users;
SELECT * FROM users;
TRUNCATE TABLE users;
UPDATE users SET user_password = "$2b$10$kLBoU.nqoSd60iRUbkegO.QhXcoR.iIANpgbSFXmkCCCjXAaigSIK" WHERE user_id > 52;

INSERT INTO users (first_name, surname, email, user_password, phone, avatar_public_id, avatar_url, user_role, dept_id)
VALUES
("Thomas", "Odhiambo", "thomasodhiambo800@gmail.com","$2b$10$kLBoU.nqoSd60iRUbkegO.QhXcoR.iIANpgbSFXmkCCCjXAaigSIK", "0740455275", null, null, "system_admin", 1),
('Megan', 'Chang', 'megan.chang1@example.com', '#5FtME7xKS*M', '+25472762998', '1a0d263c-8840-44d4-8ca5-1e8c2e13aafd', 'https://www.lorempixel.com/417/201', 'admin', 1),
('Robert', 'Green', 'robert.green2@example.com', '3&ZJhGU*+K$t', '+25478507386', 'c7daa256-9816-4da4-b77d-8032d0b61120', 'https://www.lorempixel.com/726/605', 'admin', 1),
('William', 'Sullivan', 'william.sullivan3@example.com', '!z31e*q9kPg=', '+25478943213', 'e6c906ed-b83f-424f-90f2-1922ae07d53e', 'https://dummyimage.com/308x918', 'admin', 1),
('Kristen', 'Turner', 'kristen.turner4@example.com', 'TSHTDRwooUXK', '+25470789889', '1e6b3ff3-6661-4978-8f73-42bd06258a54', 'https://dummyimage.com/799x500', 'admin', 1),
('Thomas', 'Silva', 'thomas.silva5@example.com', '@NNrqZ!FuLW1', '+25479331531', '7f3548d5-6d70-4626-8466-c24ff6a9a75f', 'https://www.lorempixel.com/849/377', 'admin', 1),
('Rebecca', 'Wagner', 'rebecca.wagner6@example.com', 'iq8z!hl1dR*O', '+25476066533', '604e8ec9-6f52-4a61-9900-657cb76d199b', 'https://www.lorempixel.com/137/720', 'admin', 1),
('Juan', 'Campos', 'juan.campos7@example.com', 'b+ojq8)bGhtq', '+25476315019', '0995ca47-ea9a-4e07-b0e7-1938705bcfac', 'https://www.lorempixel.com/366/467', 'admin', 1),
('Christine', 'King', 'christine.king8@example.com', '&J&R1p67mmOi', '+25479606989', '621e6c7f-5173-4a0e-97d9-58ca8638ffd2', 'https://dummyimage.com/465x497', 'admin', 1),
('Renee', 'Mcgrath', 'renee.mcgrath9@example.com', '@tQa4zdvs_Av', '+25473966734', '4f263556-00dc-4d23-8103-ef4eff227e56', 'https://dummyimage.com/182x101', 'admin', 1),
('Lisa', 'Barrera', 'lisa.barrera10@example.com', 'T1mqI1Z%c%R6', '+25477107489', '0ffc8fc6-0857-4c7b-b17a-de117c74dc38', 'https://dummyimage.com/873x100', 'admin', 1),
('Kyle', 'Blair', 'kyle.blair11@example.com', '^LxJ9%9o=Wg3', '+25479463270', '325eb963-7d49-4ad5-98d0-bc555be61ad8', 'https://dummyimage.com/641x726', 'admin', 1),
('Rachel', 'Sutton', 'rachel.sutton12@example.com', 'hjX%v-h#EguI', '+25477815638', '4ab462fd-b99d-4e22-8be3-ce08790db023', 'https://placeimg.com/971/119/any', 'admin', 1),
('Thomas', 'Garcia', 'thomas.garcia13@example.com', 'dptxBR##+ULW', '+25474481321', 'cf07d510-4bea-425d-8e22-1aa2afdb2229', 'https://placeimg.com/441/445/any', 'admin', 1),
('Ryan', 'Carr', 'ryan.carr14@example.com', '82zVdm-wEPwK', '+25472015043', '15304d3a-a7a4-451b-830b-dfa9773a582b', 'https://placeimg.com/211/201/any', 'admin', 1),
('Robin', 'Levy', 'robin.levy15@example.com', 'QKz89jiLcz0l', '+25471589081', '1b4d4cf0-2448-4dab-bf30-a724c6b0885c', 'https://www.lorempixel.com/162/494', 'admin', 1),
('Thomas', 'Grimes', 'thomas.grimes16@example.com', 'aDNILSZGB=t7', '+25474308794', 'ae9cde06-c3c9-4729-b970-67455984a3ad', 'https://dummyimage.com/306x221', 'admin', 1),
('Jorge', 'Trujillo', 'jorge.trujillo17@example.com', 'LtW=8VhIB!hT', '+25474564568', '131a4e92-84c5-4d29-b29b-afad202c7fff', 'https://placeimg.com/610/750/any', 'admin', 1),
('Ana', 'Smith', 'ana.smith18@example.com', 'YpUqz+&!clt7', '+25478578008', '75a27a18-58f0-4cb4-9a0a-ab015f428ca3', 'https://www.lorempixel.com/167/330', 'admin', 1),
('Jennifer', 'Ross', 'jennifer.ross19@example.com', 'jw5I$8%JCDOc', '+25470756047', 'faf73ea7-d25d-42b8-9460-0594dc0f8b78', 'https://placeimg.com/648/712/any', 'admin', 1),
('Mallory', 'Barnett', 'mallory.barnett20@example.com', 'F+#+Ur$b^4wR', '+25473428733', '1a99219f-19e9-422c-80bb-21cd11c45dce', 'https://www.lorempixel.com/756/230', 'admin', 1),
('Aaron', 'Snyder', 'aaron.snyder21@example.com', 's3z)Kk^Tg19A', '+25470441705', '6ac4e403-c0fe-4faa-b9d9-ab12ad7c89e7', 'https://www.lorempixel.com/745/431', 'admin', 1),
('Mikayla', 'Sanchez', 'mikayla.sanchez22@example.com', 'iPAD7L%UJWzj', '+25476671979', 'c36a9a5a-8dfc-4008-9205-83ba46f5a8cf', 'https://dummyimage.com/929x224', 'admin', 1),
('Mark', 'Harrell', 'mark.harrell23@example.com', 'N7o7H5I8fd)K', '+25479965208', '11670c60-4bcc-4644-be6e-2be0ee241e6f', 'https://dummyimage.com/898x614', 'admin', 1),
('James', 'Bradley', 'james.bradley24@example.com', '1FxiGR()Fh63', '+25470460997', '87235382-cc35-4471-9664-45202feed54d', 'https://www.lorempixel.com/460/172', 'admin', 2),
('John', 'Ponce', 'john.ponce25@example.com', 'j0An@rBTkaY3', '+25479726921', 'fb1bd251-23c6-4ab3-8591-20ae2638312b', 'https://placeimg.com/215/588/any', 'admin', 2),
('Linda', 'West', 'linda.west26@example.com', 'A_j+BJw)_Wn=', '+25471518983', '8502a5f1-327a-4c46-bad6-5ffe059993d8', 'https://www.lorempixel.com/342/872', 'admin', 2),
('Christopher', 'Flores', 'christopher.flores27@example.com', 'nCY$TD1kwF(S', '+25472326653', '59d661aa-c4ae-40fb-aa4c-a8113986689c', 'https://www.lorempixel.com/527/845', 'admin', 2),
('William', 'Cantu', 'william.cantu28@example.com', '&HC_goiiUl1(', '+25471419353', '95a85aaf-4d26-47ce-b417-2a533423fffc', 'https://dummyimage.com/752x188', 'admin', 2),
('Daniel', 'Arnold', 'daniel.arnold29@example.com', 'Kpa1Vaw6VPl1', '+25474672729', 'f7457e6d-c6ca-41d1-b47e-e7f65a5a9936', 'https://www.lorempixel.com/376/784', 'admin', 2),
('Jasmine', 'Kelley', 'jasmine.kelley30@example.com', 'dtNSEhtv5*Tc', '+25477335291', '201c31ba-96c0-427b-85a3-fc7633e7f54a', 'https://placeimg.com/981/396/any', 'admin', 2),
('Lisa', 'Fernandez', 'lisa.fernandez31@example.com', 'vkNpi_P4&vHR', '+25471114452', 'dbe6db71-d336-41cb-bc4e-bbd9b9adb814', 'https://dummyimage.com/584x860', 'admin', 2),
('Tamara', 'Morrison', 'tamara.morrison32@example.com', 'FK0yXew4dVbJ', '+25478050867', '2d7da58b-38a8-41ef-9341-aa14c5f9d379', 'https://dummyimage.com/504x106', 'admin', 2),
('Briana', 'Wallace', 'briana.wallace33@example.com', 'BiauWw&kRoG2', '+25473366191', 'e7c201fa-1536-466e-8d05-b090fea24fc3', 'https://placeimg.com/232/313/any', 'admin', 2),
('Caitlyn', 'Cruz', 'caitlyn.cruz34@example.com', '*H7D9Dqo)SdD', '+25472010616', 'ee1d4b6f-656a-47d2-b19b-0ed82ad22735', 'https://dummyimage.com/188x821', 'admin', 2),
('Barbara', 'Roberts', 'barbara.roberts35@example.com', '%56^Fe0YXP3G', '+25474243003', 'df235388-8578-4dd3-8957-dae092cf9769', 'https://placeimg.com/770/107/any', 'admin', 2),
('Jaime', 'Lopez', 'jaime.lopez36@example.com', 'k7Z+E(Izh^8y', '+25474300325', '8c17bd41-3496-468f-89e0-11b25cc8b058', 'https://www.lorempixel.com/957/306', 'admin', 2),
('Chloe', 'Douglas', 'chloe.douglas37@example.com', 't3wNDK%sxPaL', '+25474944402', '18a8a093-133f-4fbc-abe9-c02988aa16e4', 'https://www.lorempixel.com/523/318', 'admin', 2),
('Thomas', 'Davis', 'thomas.davis38@example.com', 'HfG5@cnLj%)y', '+25474525224', 'a8ad5f32-f8ef-43b3-a84c-9ed32014d419', 'https://dummyimage.com/573x649', 'admin', 2),
('Katherine', 'Mcdowell', 'katherine.mcdowell39@example.com', 'WubU2nFq%=aO', '+25474032952', '5b894950-c8c6-4121-8e02-4608e3fb1d66', 'https://dummyimage.com/820x659', 'admin', 2),
('Sandra', 'Kirby', 'sandra.kirby40@example.com', 'Yq@sNZrVvn9Q', '+25473501395', 'f6595b52-2aa5-4a97-9bfa-24b8e99a786f', 'https://www.lorempixel.com/238/883', 'admin', 2),
('Rachael', 'Leblanc', 'rachael.leblanc41@example.com', 'p*L6+rkrDUkL', '+25479605439', 'f2e3ed2f-21e4-42e4-b754-aa7b34169d4b', 'https://dummyimage.com/768x266', 'admin', 2),
('Amber', 'Myers', 'amber.myers42@example.com', 'YL_Kx#tT1!7D', '+25470079347', '32deea5a-ad55-4199-8eb0-741a7c2543ee', 'https://dummyimage.com/331x366', 'admin', 2),
('Janet', 'Hill', 'janet.hill43@example.com', 'AmbReVALesa)', '+25473836194', 'ed13d52f-9b86-43e6-9825-d29b48dbdeaa', 'https://www.lorempixel.com/466/419', 'admin', 2),
('Lisa', 'Atkinson', 'lisa.atkinson44@example.com', 'ny-4DFuO30Jd', '+25479430185', 'e112c11c-df4e-4764-ad90-9cb572727e50', 'https://dummyimage.com/816x251', 'admin', 2),
('Patty', 'Lawrence', 'patty.lawrence45@example.com', 'gs!n)_&4@Q2G', '+25478167603', '97876d87-b4fa-428a-812b-1083e1b8911c', 'https://dummyimage.com/850x485', 'admin', 2),
('Stephanie', 'Riley', 'stephanie.riley46@example.com', 'c(cgwlrB3EuL', '+25473395975', 'ca92e8f1-e4e8-448b-9846-85ccb5c1ac0b', 'https://placeimg.com/803/139/any', 'admin', 2),
('Shannon', 'Keller', 'shannon.keller47@example.com', 'I2ELb4cZS6w0', '+25472539925', 'c20b2eea-117c-4a2c-be93-25576764af39', 'https://placeimg.com/924/348/any', 'admin', 2),
('Wendy', 'Stark', 'wendy.stark48@example.com', 'S2ZA*&z4a!Q_', '+25473637690', '4447a149-e474-49da-9065-b626c0fd0d78', 'https://www.lorempixel.com/682/144', 'admin', 2),
('Laura', 'Miller', 'laura.miller49@example.com', 'Hza2*YYtUf)v', '+25478506596', 'd734b424-87be-4632-8fd8-b6b0070d985f', 'https://dummyimage.com/719x493', 'admin', 2),
('Chloe', 'Tucker', 'chloe.tucker50@example.com', '5uvG=2)OQ=o7', '+25477871695', '7b2fd3ec-aab8-408c-9400-384e5d73df46', 'https://placeimg.com/575/137/any', 'system_admin', 2);

SELECT u.user_id, u.first_name, u.surname, u.email, u.user_password, u.phone, u.avatar_public_id, u.avatar_url, u.user_role, u.created_at, u.updated_at, d.dept_id, d.dept_name  FROM users u JOIN department d ON u.dept_id = d.dept_id;

CREATE TABLE jobs (
    job_id INT PRIMARY KEY AUTO_INCREMENT,
    job_title VARCHAR(200) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    job_status VARCHAR(50) NOT NULL,
    job_description TEXT(300) NOT NULL,
    job_location VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    estimated_time VARCHAR(5) NOT NULL,
    assigned_technician_id INT NOT NULL,
    scheduled_date DATETIME NOT NULL,
    job_notes TEXT(300) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_technician_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

SELECT * FROM jobs;
DROP TABLE jobs;
SELECT j.job_id, j.job_title, j.job_type, j.job_status, j.job_description, j.job_location, j.priority, j.estimated_time, j.scheduled_date, j.job_notes, j.assigned_technician_id, u.first_name as `technician_first_name`, u.surname as `technician_surname`, j.created_at, j.updated_at  FROM jobs j JOIN users u ON j.assigned_technician_id = u.user_id;

INSERT INTO jobs (
    job_title, job_type, job_status, job_description, job_location, priority,
    estimated_time, assigned_technician_id, scheduled_date, job_notes
) VALUES
('AC Unit Replacement - Office Block B', 'HVAC', 'In Progress', 'Replace faulty air conditioning unit', 'Nairobi, Westlands', 'medium', '240', 62, '2025-09-20 09:00:00', 'Access via basement parking'),
('Leaking Pipe Repair - Hotel Kitchen', 'Plumbing', 'Completed', 'Seal leak in main kitchen water pipe', 'Mombasa, CBD', 'high', '120', 73, '2025-09-22 14:00:00', 'Water supply will be shut off during repair'),
('Security Camera Installation - Warehouse', 'Electrical', 'Rejected', 'Install and configure 4 CCTV cameras', 'Kisumu, Industrial Area', 'low', '300', 88, '2025-09-25 08:30:00', 'All equipment provided on-site'),
('Elevator Maintenance - Apartment Block A', 'Mechanical', 'Assigned', 'Routine elevator safety inspection and servicing', 'Nairobi, Kilimani', 'medium', '180', 54, '2025-09-10 10:00:00', 'Maintenance log to be updated after work'),
('Roof Leak Repair - Residential House', 'Roofing', 'In Progress', 'Replace damaged shingles and seal leak', 'Eldoret, Langas', 'high', '240', 95, '2025-09-19 07:30:00', 'Owner will be present during work'),
('Parking Lot Light Replacement', 'Electrical', 'Completed', 'Replace 6 faulty floodlights', 'Nairobi, South C', 'medium', '200', 59, '2025-09-23 17:00:00', 'Ladder and lift available on-site'),
('Fire Alarm System Testing - Hospital', 'Safety', 'Rejected', 'Test and reset all fire alarm units', 'Nakuru, CBD', 'high', '150', 100, '2025-09-26 11:00:00', 'Notify staff before triggering alarms'),
('Ceiling Fan Installation - Community Hall', 'Electrical', 'Assigned', 'Install 3 ceiling fans', 'Kisii, Nyanchwa', 'low', '180', 83, '2025-09-21 09:15:00', 'Fans provided by client'),
('Pest Control - Grocery Store', 'Sanitation', 'In Progress', 'Spray and set traps for rodents', 'Nairobi, Donholm', 'high', '120', 77, '2025-09-05 06:00:00', 'Work to be done before store opens'),
('Fence Welding - Factory Perimeter', 'Metalwork', 'Completed', 'Repair broken steel fence sections', 'Thika, Makongeni', 'medium', '210', 65, '2025-09-29 08:00:00', 'Safety gear required'),
('Water Pump Servicing - Borehole', 'Plumbing', 'Rejected', 'Lubricate and check pump functionality', 'Kitale, Milimani', 'low', '180', 97, '2025-09-27 10:30:00', 'Spare parts available if needed'),
('Tile Replacement - School Corridor', 'Masonry', 'Assigned', 'Replace cracked floor tiles', 'Nairobi, Umoja', 'medium', '240', 89, '2025-09-16 13:00:00', 'Students on break during repair'),
('Signboard Installation - Restaurant', 'Carpentry', 'In Progress', 'Mount new exterior signboard', 'Mombasa, Nyali', 'low', '150', 60, '2025-09-30 15:00:00', 'Requires drilling into concrete'),
('Generator Repair - Office Complex', 'Electrical', 'Completed', 'Fix starter motor issue', 'Nairobi, Karen', 'high', '210', 85, '2025-09-17 07:00:00', 'Client requests minimal downtime'),
('Door Lock Replacement - Hotel Suite', 'Carpentry', 'Rejected', 'Replace broken electronic lock', 'Naivasha, Town Center', 'medium', '90', 66, '2025-09-12 12:00:00', 'Provide new keycards'),
('Pavement Crack Sealing - Driveway', 'Masonry', 'Assigned', 'Seal and resurface cracked areas', 'Nairobi, Runda', 'low', '180', 99, '2025-09-28 14:00:00', 'Dry weather needed for work'),
('Window Frame Replacement - Office', 'Glasswork', 'In Progress', 'Install new aluminum window frames', 'Kisumu, CBD', 'high', '300', 58, '2025-09-24 09:45:00', 'Old frames already removed'),
('IT Network Cabling - Data Center', 'Networking', 'Completed', 'Run new Cat6 cables and terminate', 'Nairobi, Upper Hill', 'high', '360', 84, '2025-09-15 08:00:00', 'Work after peak hours preferred'),
('Garden Sprinkler Installation', 'Plumbing', 'Rejected', 'Install automatic irrigation system', 'Nakuru, Milimani', 'medium', '240', 93, '2025-09-07 07:30:00', 'System connected to main water line'),
('Glass Partition Installation - Office', 'Glasswork', 'Assigned', 'Fit and secure glass partition panels', 'Nairobi, CBD', 'medium', '200', 53, '2025-09-18 11:00:00', 'Handle glass with care'),
('Solar Panel Maintenance - School Roof', 'Electrical', 'In Progress', 'Clean and check solar panels for efficiency', 'Machakos, Town Center', 'low', '180', 64, '2025-09-13 09:00:00', 'Avoid working during rain'),
('Boiler Servicing - Textile Factory', 'Mechanical', 'Completed', 'Service boiler and replace worn-out parts', 'Eldoret, Industrial Area', 'high', '300', 91, '2025-09-19 08:30:00', 'Wear protective clothing'),
('Street Light Repair - Highway Section', 'Electrical', 'Rejected', 'Replace damaged street lights', 'Nairobi, Outering', 'medium', '240', 76, '2025-09-28 20:00:00', 'Night shift required'),
('Air Duct Cleaning - Mall', 'HVAC', 'Assigned', 'Clean air ducts to improve airflow', 'Nairobi, CBD', 'low', '200', 54, '2025-09-22 07:45:00', 'Access from maintenance room'),
('Printer Repair - Government Office', 'IT Support', 'In Progress', 'Fix paper jam and service printer', 'Kisumu, Milimani', 'medium', '90', 63, '2025-09-16 11:00:00', 'Parts available on-site'),
('Exterior Painting - Residential Block', 'Painting', 'Completed', 'Repaint exterior walls and balconies', 'Mombasa, Tudor', 'high', '360', 81, '2025-09-26 09:30:00', 'Use weatherproof paint'),
('Server Rack Installation - Data Center', 'Networking', 'Rejected', 'Assemble and install new server racks', 'Nairobi, Upper Hill', 'medium', '300', 92, '2025-09-18 08:00:00', 'Check electrical load before setup'),
('Kitchen Hood Cleaning - Restaurant', 'Sanitation', 'Assigned', 'Deep clean kitchen exhaust hood', 'Thika, CBD', 'low', '150', 70, '2025-09-14 06:30:00', 'Work before opening hours'),
('Parking Gate Automation', 'Mechanical', 'In Progress', 'Install automatic gate motors', 'Nairobi, Karen', 'high', '240', 66, '2025-09-27 13:00:00', 'Test system before handover'),
('Cold Room Servicing - Butchery', 'HVAC', 'Completed', 'Service refrigeration system', 'Nakuru, CBD', 'high', '180', 52, '2025-09-17 06:00:00', 'Keep products chilled during service'),
('Shower Mixer Replacement - Apartment', 'Plumbing', 'Rejected', 'Replace faulty shower mixer tap', 'Nairobi, Donholm', 'medium', '90', 72, '2025-09-29 10:00:00', 'Tenant will be at home'),
('Emergency Exit Sign Installation', 'Electrical', 'Assigned', 'Install illuminated emergency exit signs', 'Eldoret, CBD', 'low', '120', 79, '2025-09-21 16:00:00', 'Test battery backup'),
('Conference Room AV Setup', 'IT Support', 'In Progress', 'Install projector and sound system', 'Kisumu, Milimani', 'medium', '210', 87, '2025-09-19 15:30:00', 'Cables to be concealed'),
('Roof Gutter Cleaning - Office', 'Roofing', 'Completed', 'Remove debris from roof gutters', 'Nairobi, Westlands', 'low', '150', 98, '2025-09-25 07:00:00', 'Dispose waste properly'),
('CCTV System Upgrade - Bank', 'Security', 'Rejected', 'Replace DVR and cameras', 'Nairobi, CBD', 'high', '300', 55, '2025-09-23 09:15:00', 'Security clearance required'),
('Landscaping - Hotel Garden', 'Gardening', 'Assigned', 'Trim hedges and plant flowers', 'Mombasa, Nyali', 'medium', '240', 86, '2025-09-15 07:45:00', 'Use client’s preferred plants'),
('Garage Door Repair - Warehouse', 'Mechanical', 'In Progress', 'Repair motorized garage door', 'Thika, Industrial Area', 'medium', '200', 96, '2025-09-28 11:15:00', 'Lubricate all moving parts'),
('Water Heater Installation - Clinic', 'Plumbing', 'Completed', 'Install electric water heater', 'Nairobi, Kilimani', 'high', '180', 78, '2025-09-20 14:00:00', 'Test before leaving site'),
('Floor Polishing - Office Lobby', 'Cleaning', 'Rejected', 'Polish marble floor', 'Nakuru, CBD', 'medium', '150', 67, '2025-09-18 18:00:00', 'Use non-slip polish'),
('Backup Generator Fueling', 'Electrical', 'Assigned', 'Refuel standby generator', 'Nairobi, Karen', 'low', '60', 80, '2025-09-19 05:30:00', 'Check oil levels'),
('PABX System Setup - Office', 'IT Support', 'In Progress', 'Install and configure telephone exchange', 'Nairobi, Upper Hill', 'medium', '240', 61, '2025-09-24 10:00:00', 'Label all extensions'),
('Swimming Pool Pump Repair', 'Plumbing', 'Completed', 'Fix pool water pump', 'Mombasa, Bamburi', 'high', '150', 52, '2025-09-21 12:00:00', 'Check filtration system'),
('Fire Extinguisher Refilling - School', 'Safety', 'Rejected', 'Refill 20 fire extinguishers', 'Kisumu, CBD', 'medium', '180', 88, '2025-09-29 08:30:00', 'Tag all serviced units'),
('Warehouse Shelving Installation', 'Carpentry', 'Assigned', 'Install heavy-duty shelves', 'Nairobi, Industrial Area', 'high', '300', 73, '2025-09-15 09:00:00', 'Bolt shelves to the floor'),
('Borehole Chlorination', 'Plumbing', 'In Progress', 'Chlorinate borehole water system', 'Kitale, Milimani', 'low', '120', 75, '2025-09-18 07:15:00', 'Measure chlorine levels'),
('Escalator Repair - Shopping Mall', 'Mechanical', 'Completed', 'Replace escalator belt', 'Nairobi, CBD', 'high', '240', 90, '2025-09-22 10:30:00', 'Test after repair'),
('Office Partition Demolition', 'Construction', 'Rejected', 'Remove old partitions', 'Nairobi, Westlands', 'medium', '180', 69, '2025-09-25 08:00:00', 'Dispose debris responsibly'),
('Printer Networking Setup - Library', 'IT Support', 'Assigned', 'Connect printers to network', 'Thika, CBD', 'low', '90', 85, '2025-09-16 13:15:00', 'Install drivers on all PCs');

