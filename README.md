<div align="center">
    <h1 style="font-size: 2em;"><strong>Fitlance</strong></h1>
</div>
<div align="center" style="margin-bottom: 20px;">
    Fitlance is an application people can use to find personal trainers based on exercise interests.
</div>

<h2 style="font-size: 1.5em;">Key Features:</h2>
<ul>
    <li>Uses Dotnet Identity to manage user and trainer accounts</li>
</ul>

<h2 style="font-size: 1.5em;">Prerequisites:</h2>
<ul>
    <li>.NET 6 SDK</li>
    <li>Node.js</li>
    <li>npm</li>
    <li>Microsoft SQL Server</li>
    <li>Git</li>
    <li>Web Browser</li>
    <li>Terminal such as Git Bash</li>
</ul>

<h2 style="font-size: 1.5em;">Recommended:</h2>
<ul>
    <li>Visual Studio 2022</li>
</ul>

<h2 style="margin-top: 20px; font-size: 1.5em;">Prerequisites Installation Guide</h2>


<h3>1. .NET 6.0 SDK</h3>
<ul>
    <li><strong>Windows/Linux/macOS</strong>: 
        <ol>
        <li>Download the .NET 6.0 SDK from the <a href="https://dotnet.microsoft.com/download/dotnet/6.0">.NET official website</a>.</li>
        <li>Follow the installation instructions for your operating system.</li>
        </ol>
    </li>
</ul>

<h3>2. Node.js</h3>
<ul>
    <li><strong>Windows/Linux/macOS</strong>:
        <ol>
        <li>Visit the <a href="https://nodejs.org/en/download/">Node.js download page</a>.</li>
        <li>Choose the installer appropriate for your operating system.</li>
        <li>Run the installer and follow the prompts to complete the installation.</li>
        </ol>
    </li>
</ul>

<h3>3. npm (Node Package Manager)</h3>
<p>npm is included with Node.js, so installing Node.js will also install npm.</p>

<h3>4. Visual Studio 2022 (Optional but Recommended)</h3>
<ul>
    <li><strong>Windows</strong>:
        <ol>
        <li>Download Visual Studio 2022 Community Edition (free) from the <a href="https://visualstudio.microsoft.com/vs/">Visual Studio website</a>.</li>
        <li>During installation, select the “ASP.NET and web development” workload to ensure the necessary components are installed.</li>
        </ol>
    </li>
</ul>

<h3>5. Entity Framework Core Tools</h3>
<p>Install via the .NET CLI with the following command:</p>
<pre><code>dotnet tool install --global dotnet-ef</code></pre>

<h3>6. SQL Server</h3>
<ul>
  <li><strong>Windows/Linux/macOS</strong>:
    <ol>
      <li>Download SQL Server Express from the <a href="https://www.microsoft.com/en-us/sql-server/sql-server-downloads">SQL Server Express download page</a>.</li>
      <li>Follow the installation guide provided on the download page.</li>
    </ol>
  </li>
</ul>

<h3>7. ASP.NET Core Runtime</h3>
<p>Typically included in the .NET 6.0 SDK. Ensure that it is installed during the .NET SDK setup.</p>

<h3>8. A Web Browser</h3>
<p>Ensure you have a modern web browser like Google Chrome, Mozilla Firefox, or Microsoft Edge for testing your application.</p>

<h3>9. Git (Optional)</h3>
<ul>
  <li><strong>Windows/Linux/macOS</strong>:
    <ol>
      <li>Download Git from <a href="https://git-scm.com/downloads">Git SCM</a>.</li>
      <li>Run the installer and follow the instructions to complete the installation.</li>
    </ol>
  </li>
</ul>

<h1>Post-Installation Steps</h1>
<h3 style="font-size: 1.3em;">1. Cloning the Repository</h3>
<p>Follow these steps to clone the FitlanceSolution repository from GitHub:</p>

<ul>
    <li>
        <strong>Ensure Git is Installed:</strong> 
        <p>Before proceeding, make sure Git is installed on your system. You can check by running <code>git --version</code> in your terminal. If Git is not installed, follow the installation guide in the prerequisites section.</p>
    </li>
    <li>
        <strong>Open Terminal or Command Prompt:</strong>
        <p>Navigate to the directory where you want to clone the repository.</p>
    </li>
    <li>
        <strong>Clone the Repository:</strong>
        <p>Run the following command in your terminal:</p>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;"><code>git clone https://github.com/thomasfriedrichs/FitlanceSolution.git</code></pre>
        <p>This will create a new folder named <code>FitlanceSolution</code> containing the project files.</p>
    </li>
    <li>
        <strong>Navigate to the Project Directory:</strong>
        <p>Change directory to the newly cloned repository:</p>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;"><code>cd FitlanceSolution</code></pre>
    </li>
    <li>
        <strong>Verify the Setup:</strong>
        <p>Ensure that all the files and directories of the project are present. You can now proceed with the project-specific setup instructions.</p>
    </li>
</ul>

<p>With these steps, you will have successfully cloned the FitlanceSolution repository and can begin working on the project.</p>
<h3 style="font-size: 1.3em;">2. Restoring Project Dependencies</h3>
<p>After cloning the repository, the next step is to restore the project dependencies for both the .NET backend and the React frontend:</p>

<ul>
    <li>
        <strong>Restore .NET Dependencies:</strong>
        <p>In the root directory of the cloned project (where the solution file is located), open a terminal or command prompt.</p>
        <p>Run the following command to restore all the .NET dependencies:</p>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;"><code>dotnet restore</code></pre>
        <p>This command will download and install all the necessary NuGet packages required by the project.</p>
    </li>
    <li>
        <strong>Install Node.js Dependencies:</strong>
        <p>Navigate to the <code>ClientApp</code> directory within the project:</p>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;"><code>cd ClientApp</code></pre>
        <p>Run the following command to install all the node dependencies required by the React application:</p>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;"><code>npm install</code></pre>
        <p>This will install all dependencies listed in the project's <code>package.json</code> file.</p>
    </li>
</ul>

<p>Completing these steps ensures that both the backend and frontend parts of your application have all the required dependencies installed</p>


<h3 style="font-size: 1.3em;">3. Generating a Trusted Local SSL Certificate</h3>
<p>To set up HTTPS locally and have your browser trust the SSL certificate, follow these steps:</p>

<ul>
    <li>
        <strong>Install OpenSSL:</strong> If not already installed, download and install OpenSSL. It's available for Windows, Linux, and macOS.
        <ul>
        <li>Windows: Download from <a href="https://slproweb.com/products/Win32OpenSSL.html">slproweb</a>.</li>
        <li>Linux/macOS: Usually pre-installed, or install via your package manager.</li>
        </ul>
    </li>
    <li>
        <strong>Generate a Private Key and Certificate Signing Request (CSR):</strong>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;"><code>openssl req -newkey rsa:2048 -nodes -keyout localhost.key -out localhost.csr</code></pre>
        <p>During the process, enter your details as prompted, especially the 'Common Name' (CN) which should be set to <code>localhost</code>.</p>
    </li>
    <li>
        <strong>Generate a Self-Signed Certificate:</strong>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;"><code>openssl x509 -signkey localhost.key -in localhost.csr -req -days 365 -out localhost.crt</code></pre>
    </li>
    <li>
        <strong>Convert to PFX Format:</strong>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;"><code>openssl pkcs12 -export -out localhost.pfx -inkey localhost.key -in localhost.crt</code></pre>
        <p>When prompted, create a password for the PFX file. This password will be used in your <code>appsettings.Development.Local.json</code> configuration.</p>
    </li>
    <li>
        <strong>Trust the Certificate:</strong>
        <ul>
        <li>
            <strong>Windows:</strong> Double-click the <code>localhost.crt</code> file and install it to the 'Trusted Root Certification Authorities' store.
        </li>
        <li>
            <strong>macOS:</strong> Open Keychain Access, import <code>localhost.crt</code> to the 'System' keychain, and set it to 'Always Trust'.
        </li>
        <li>
            <strong>Linux:</strong> Trusting certificates varies by distribution, but generally involves adding the certificate to a system-wide trust store.
        </li>
        </ul>
    </li>
    <li>
        <strong>Update Your Application Configuration:</strong>
        <p>Use the generated <code>localhost.pfx</code> in your application's SSL configuration, referencing it in the <code>appsettings.Development.Local.json</code> file with the password you set.</p>
    </li>
</ul>

<p>After completing these steps, your application will be able to use HTTPS locally with a browser-trusted certificate.</p>
<h3 style="font-size: 1.3em;">4. Open the project in Visual Studio 2022 or your preferred IDE.</h3>
<h3 style="font-size: 1.3em;">5. Add Local Configuration File</h3>
<p>Create a file named <code>appsettings.Development.Local.json</code> in FitlanceSolution/Fitlance with the following configuration:</p>
<pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
    <code>
            {
            "Logging": {
                "LogLevel": {
                "Default": "Information",
                "Microsoft": "Warning",
                "Microsoft.AspNetCore.SpaProxy": "Information",
                "Microsoft.Hosting.Lifetime": "Information"
                }
            },
            "JWT": {
                "ValidAudience": "https://localhost:44406",
                "ValidIssuer": "https://localhost:7021",
                "Secret": "YOUR_SECURE_PASSWORD"
            },
            "ConnectionStrings": {
                "DefaultConnection": "Server=YOUR_LOCAL_SERVER;Database=Fitlance;Trusted_Connection=True;TrustServerCertificate=True;"
            },
            "Kestrel": {
                "EndPoints": {
                "Https": {
                    "Url": "https://localhost:7021",
                    "Certificate": {
                    "Password": "YOUR_CERT_PASSWORD",
                    "Path": "PATH_TO_TRUSTED_LOCAL_CERT.pfx"
                    }
                }
                }
            }
            }
    </code>
</pre>
<h3 style="font-size: 1.3em;">6. Adding a Local Environment File for the Client Application</h3>
<p>To configure environment-specific settings for the client application, follow these steps:</p>

<ul>
    <li>
        <strong>Navigate to the ClientApp Directory:</strong>
        <p>Open the <code>ClientApp</code> directory in your project folder.</p>
    </li>
    <li>
        <strong>Create a .env.local File:</strong>
        <p>Create a new file named <code>.env.local</code> in the <code>ClientApp</code> directory.</p>
    </li>
    <li>
        <strong>Add Environment Variables:</strong>
        <p>Copy and paste the following content into the <code>.env.local</code> file:</p>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
        <code>
REACT_APP_USER_EMAIL=EMAIL_OF_YOUR_CHOICE
REACT_APP_USER_PASSWORD=PASSWORD_OF_YOUR_CHOICE

REACT_APP_TRAINER_EMAIL=EMAIL_OF_YOUR_CHOICE
REACT_APP_TRAINER_PASSWORD=PASSWORD_OF_YOUR_CHOICE

REACT_APP_API_BASE_URL=https://localhost:7021
        </code>
        </pre>
        <p>These variables will be used to configure the guest logins.</p>
    </li>
    <li>
        <strong>Save the File:</strong>
        <p>After adding the content, save the <code>.env.local</code> file.</p>
    </li>
</ul>
<p>By completing these steps, you will have successfully added a local environment file for the client application, which will be used when running the application locally.</p>

<h3 style="font-size: 1.3em;">7. Connecting to Local Microsoft SQL Server and Running Migrations</h3>
<p>After setting up your local environment, connect to a Microsoft SQL Server instance and run Entity Framework Core migrations to set up your database:</p>
<ul>
    <li>
        <strong>Configure the Connection String:</strong>
        <p>Open the <code>appsettings.Development.Local.json</code> file in the <code>Fitlance</code> directory. Ensure the <code>DefaultConnection</code> string matches your local SQL Server configuration.</p>
    </li>
    <li>
        <strong>Open the Project in Visual Studio 2022 or Preferred IDE:</strong>
        <p>Open the <code>FitlanceSolution</code> solution file in Visual Studio 2022 or your preferred IDE that supports .NET 6.0.</p>
    </li>
    <li>
        <strong>Run Entity Framework Core Migrations:</strong>
        <p>Open a terminal in your IDE or use the Command Prompt/Terminal. Navigate to the project directory where the <code>.csproj</code> file is located.</p>
        <p>Run the following command to apply migrations:</p>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;"><code>dotnet ef database update</code></pre>
        <p>This will apply the necessary database schema changes to your local SQL Server instance.</p>
    </li>
    <li>
        <strong>Verify Database Creation:</strong>
        <p>Check your SQL Server instance (using SQL Server Management Studio or another tool) to ensure the database and tables have been created successfully.</p>
    </li>
</ul>
<p>Completing these steps will set up your local database, allowing the application to interact with it correctly.</p>

<h3 style="font-size: 1.3em;">8. Starting Up the Application and Setting Up User Accounts</h3>
<p>After completing the initial setup, follow these steps to start the application and set up user and trainer accounts:</p>

<ul>
    <li>
        <strong>Start the Application:</strong>
        <p>Run the application from Visual Studio by pressing 'F5', or use the <code>dotnet run</code> command in the terminal. This starts both the backend server and the React frontend.</p>
    </li>
    <li>
        <strong>Navigate to the Login Interface:</strong>
        <p>The browser should open automatically. Click on the 'Login' button in the top right corner of the homepage.</p>
    </li>
    <li>
        <strong>Register a User Account:</strong>
        <p>Switch to the 'Register' tab in the login interface. Fill out the registration form to create a new user account. Remember to use or note down the email and password you intend to set in the <code>.env.local</code> file. Select the 'User' role and complete the registration. Locate and save the 'Id' cookie value from your browser's developer tools, as it's needed for seeding data.</p>
    </li>
    <li>
        <strong>Register a Trainer Account:</strong>
        <p>Repeat the registration process for a 'Trainer' account, ensuring you save the 'Id' value for this account as well.</p>
    </li>
    <li>
        <strong>Shut Down the Application:</strong>
        <p>Once both accounts are registered and the 'Id' values are noted, close the application in your development environment.</p>
    </li>
</ul>

<p>By completing these steps, you will have the necessary user and trainer accounts set up, along with their respective 'Id' values for data seeding purposes.</p>

<h3 style="font-size: 1.3em;">9. Seeding Data in the Application</h3>
<p>To seed appointment data into the application, follow these steps:</p>

<ul>
    <li>
        <strong>Set Up the AppointmentSeeder.js File:</strong>
        <p>Navigate to the <code>FitlanceSolution/Fitlance/Data</code> directory in your project. Open the <code>AppointmentSeeder.js</code> file. Set the <code>clientId</code> and <code>trainerId</code> variables to their respective values obtained from the 'Id' cookie during the account registration process.</p>
    </li>
    <li>
        <strong>Configure appsettings.json:</strong>
        <p>Open the <code>appsettings.json</code> file in the root of the <code>Fitlance</code> project. Modify the following settings to <code>true</code>:</p>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;"><code>
"SeedAppointmentDataOnStartup": true,
"SeedTrainerDataOnStartup": true
        </code></pre>
        <p>This change enables the seeding of appointment and trainer data when the application starts.</p>
    </li>
    <li>
        <strong>Start the Application:</strong>
        <p>Run the application again. Upon startup, the seeding logic will execute, populating the database with the appointment and trainer data based on the provided Ids.</p>
    </li>
    <li>
        <strong>Revert Seeding Settings:</strong>
        <p>After the initial seeding, remember to change the <code>SeedAppointmentDataOnStartup</code> and <code>SeedTrainerDataOnStartup</code> settings back to <code>false</code> in the <code>appsettings.json</code> file. This prevents re-seeding of data on every startup.</p>
    </li>
</ul>

<p>Completing these steps ensures that your application is populated with the necessary initial data for appointments and trainers.</p>
