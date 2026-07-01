# Railway Database Setup Guide

This guide details the step-by-step procedure to deploy and configure the MySQL database on Railway for the EduNet production backend.

---

## 1. Prerequisites
* A [Railway account](https://railway.app/).
* The database schema backup file: `database.sql` (located at the project root).
* A MySQL CLI client or a database administrator GUI (e.g. DBeaver, TablePlus, or phpMyAdmin) on your local machine.

---

## 2. Deploying MySQL on Railway

1. **Create a New Project**:
   * Go to your Railway Dashboard.
   * Click **New Project** in the upper right.
   * Select **Provision MySQL** from the list of templates.

2. **Wait for Provisioning**:
   * Railway will deploy a MySQL container service.
   * Once initialized, click on the **MySQL** card in your dashboard project page.

3. **Access Connection Credentials**:
   * Navigate to the **Variables** tab of the MySQL service.
   * Locate the following environment variables (which will be supplied automatically to any connected backend):
     * `MYSQLUSER` (default: root)
     * `MYSQLPASSWORD`
     * `MYSQLHOST`
     * `MYSQLPORT` (default: 3306)
     * `MYSQLDATABASE`
     * `DATABASE_URL` (e.g., `mysql://root:password@host:port/railway`)

---

## 3. Importing the Database Schema

To initialize the database tables, we need to import the tables and default values from `database.sql`.

### Method A: Via Command Line (Recommended)
Open your terminal and run the following command using the credentials from the **Variables** tab (replace placeholders with actual values):

```bash
mysql -h <MYSQLHOST> -u <MYSQLUSER> -p<MYSQLPASSWORD> -P <MYSQLPORT> <MYSQLDATABASE> < database.sql
```
*Note: There is no space between `-p` and the password.*

### Method B: Via DBeaver or TablePlus
1. Create a new MySQL connection.
2. Enter the host, port, user, and password from the variables tab.
3. Open a SQL Console.
4. Open the `database.sql` file in the console and execute all queries.

---

## 4. Connecting MySQL to your Render Backend
Once the database schema is loaded, copy the value of the `DATABASE_URL` variable. This single connection string will be provided as an environment variable in the Render Backend settings.

---

## 5. Troubleshooting Database Issues

* **Error: `ETIMEDOUT`**:
  Ensure you are using the public hostname/port (from the variables tab) if connecting from outside Railway. If connecting from a backend running *inside* the same Railway project, use private network variables instead.
* **Database Reset/Loss of Data**:
  Ensure MySQL storage is persisted by checking the Railway project volume mounts (Railway handles this automatically for default templates).
