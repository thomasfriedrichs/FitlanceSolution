<div align="center">
    <h1 style="font-size: 2em;"><strong>Fitlance</strong></h1>
</div>
<div align="center" style="margin-bottom: 20px; font-size: 1.3em;">
    Fitlance is an application people can use to find personal trainers based on exercise interests.
</div>

<h2 style="font-size: 1.5em;">Key Features:</h2>
<ul>
    <li><strong>User and Trainer Account Management:</strong> Utilizes .NET Identity for secure handling of user accounts. This includes features like registration, authentication, password recovery, and role-based access control.</li>
    <li><strong>Appointment Booking System:</strong> Integrated appointment booking system allowing users to schedule sessions with trainers at their convenience.</li>
    <li><strong>Interactive Calendar:</strong> Features an interactive calendar for users and trainers to manage their training sessions and availability.</li>
    <li><strong>Mobile Responsive Design:</strong> The application is fully responsive, providing a seamless experience across various devices and screen sizes.</li>
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

<h2 style="margin-top: 20px; font-size: 2em;">Prerequisites Installation Guide</h2>


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

<h1 style="font-size: 2em;">Post-Installation Steps</h1>
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

<h1 style="font-size: 2em;">Testing</h1>
<h3 style="font-size: 1.3em;">Running and Understanding xUnit Tests</h3>
<p>This section provides guidance on executing and interpreting xUnit tests within the project.</p>

<ul>
    <li>
        <strong>Running xUnit Tests Locally:</strong>
        <p>To run tests locally, use the <code>dotnet test</code> command in the terminal or the Test Explorer in Visual Studio. This will execute all the unit tests in your test project.</p>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;"><code>dotnet test</code></pre>
    </li>
    <li>
        <strong>CI/CD Pipeline Execution:</strong>
        <p>Tests are automatically run as part of the CI/CD pipeline. Check the pipeline's YAML configuration for details on how tests are integrated.</p>
    </li>
    <li>
        <strong>Interpreting Test Results:</strong>
        <p>Review the output of the test run in your terminal or CI/CD pipeline interface to verify test outcomes. Investigate any failures or errors to maintain the integrity of the application.</p>
    </li>
    <li>
        <strong>Adding and Modifying Tests:</strong>
        <p>When adding new features or modifying existing ones, update or add corresponding unit tests. Follow best practices for writing effective tests and document their purpose clearly.</p>
    </li>
</ul>

<h3 style="font-size: 1.3em;">Deploying to Azure</h3>
<p>Deploying the Fitlance application to Azure involves a few key steps to ensure a smooth transition from development to production.</p>

<ul>
    <li>
        <strong>Setting Up Azure Resources:</strong>
        <p>Create necessary Azure resources, including an Azure App Service for web hosting and an Azure SQL Database for data storage. You can do this via the Azure Portal or Azure CLI.</p>
    </li>
    <li>
        <strong>Configuring Azure Deployment Settings:</strong>
        <p>Configure deployment settings in the Azure App Service. This includes setting up environment variables, connection strings, and any other required configuration settings.</p>
    </li>
    <li>
        <strong>Deploying the Application:</strong>
        <p>Deploy your application to Azure using your preferred method. This can be done through Visual Studio's integrated Azure deployment tool, Azure DevOps pipelines, or directly from the command line using Azure CLI.</p>
    </li>
    <li>
        <strong>Monitoring and Maintenance:</strong>
        <p>Once deployed, monitor your application's performance and health through Azure's monitoring tools. Regularly update and maintain the application to ensure security and efficiency.</p>
    </li>
</ul>
<p>For detailed steps and guidance, refer to Azure's official documentation and ensure that your deployment aligns with Azure's best practices.</p>

<h2 style="font-size: 2em;">Built With</h2>
<p>This section details the main technologies and tools used in the development of the Fitlance application.</p>

<ul>
    <li>
        <strong>.NET 6:</strong>
        <p>The backend of Fitlance is built using .NET 6, a free, cross-platform, open-source developer platform for building many different types of applications.</p>
    </li>
    <li>
        <strong>ASP.NET Core Identity:</strong>
        <p>ASP.NET Core Identity is used for user and trainer account management, providing a full-featured solution for securing web applications.</p>
    </li>
    <li>
        <strong>Entity Framework Core:</strong>
        <p>An object-database mapper that enables .NET developers to work with a database using .NET objects, used for data access in the application.</p>
    </li>
    <li>
        <strong>React:</strong>
        <p>The frontend is developed with React, a JavaScript library for building user interfaces, particularly single-page applications.</p>
    </li>
    <li>
        <strong>Axios:</strong>
        <p>Axios is utilized for making HTTP requests from the browser, facilitating communication with the backend.</p>
    </li>
    <li>
        <strong>Formik:</strong>
        <p>Formik is integrated to manage form states in React, simplifying form validation and handling.</p>
    </li>
    <li>
        <strong>Tailwind CSS:</strong>
        <p>Tailwind CSS is used for styling the application, providing a utility-first CSS framework for rapidly building custom designs.</p>
    </li>
    <li>
        <strong>React Big Calendar:</strong>
        <p>This library is used to add calendar functionalities in the application, enhancing the user interface for scheduling and managing appointments.</p>
    </li>
    <li>
        <strong>Yup:</strong>
        <p>Yup is used in conjunction with Formik for object schema validation, enhancing form validation processes.</p>
    </li>
    <li>
        <strong>js-cookie:</strong>
        <p>js-cookie simplifies the handling of cookies within the application, aiding in state management and authentication processes.</p>
    </li>
    <li>
        <strong>jwt-decode:</strong>
        <p>jwt-decode is used for decoding JWTs (JSON Web Tokens) in the application, particularly useful for authentication and authorization.</p>
    </li>
    <li>
        <strong>Microsoft SQL Server:</strong>
        <p>The primary database system used for storing and managing the application's data.</p>
    </li>
    <li>
        <strong>Azure App Service:</strong>
        <p>Used for hosting the web application, providing a fully managed platform with built-in infrastructure maintenance, security patching, and scaling.</p>
    </li>
    <li>
        <strong>xUnit:</strong>
        <p>A free, open-source, community-focused unit testing tool for the .NET Framework, used for writing and running tests in the Fitlance project.</p>
    </li>
    <li>
        <strong>YAML (CI/CD Pipelines):</strong>
        <p>YAML configurations are used to define the continuous integration and continuous deployment pipelines, automating the testing and deployment process.</p>
    </li>
    <li>
        <strong>Visual Studio 2022:</strong>
        <p>The primary integrated development environment (IDE) used for developing the application, offering powerful tools and features for .NET development.</p>
    </li>
    <li>
        <strong>Node.js and npm:</strong>
        <p>Node.js serves as the runtime environment for the React frontend, with npm used for managing JavaScript packages.</p>
    </li>
    <li>
        <strong>Azure SQL Database:</strong>
        <p>A fully managed relational database with built-in intelligence, used in production for the application's data storage.</p>
    </li>
</ul>

<h2 style="font-size: 2em;">Contributions</h2>
<p>I warmly welcome contributions to the Fitlance project. If you're interested in helping out, here's how you can get involved:</p>

<ul>
    <li>
        <strong>Reporting Issues:</strong>
        <p>If you find a bug or have a feature request, please open an issue on our GitHub repository. Provide as much information as possible, such as steps to reproduce the bug and potential solutions or ideas for new features.</p>
    </li>
    <li>
        <strong>Submitting Pull Requests:</strong>
        <p>If you've developed a new feature or fixed a bug, you can submit a pull request. Please ensure your code follows the project's coding standards and includes appropriate tests (if applicable).</p>
    </li>
    <li>
        <strong>Code Reviews:</strong>
        <p>Reviewing pull requests from other contributors is a great way to get involved. Offer constructive feedback and suggestions to help improve the code quality.</p>
    </li>
    <li>
        <strong>Documentation:</strong>
        <p>Improving documentation, fixing typos, or clarifying sections that are unclear are also valuable contributions. Good documentation helps everyone!</p>
    </li>
</ul>

<p>Your contributions, no matter how small, are greatly appreciated and help make the Fitlance project better for everyone.</p>

<h2 style="font-size: 2em;">Author</h2>
<p>The Fitlance application was developed by:</p>

<strong>Thomas Friedrichs</strong>
<p>Email: <a href="mailto:thomasfriedrichs@msn.com">thomasfriedrichs@msn.com</a></p>

<p>For inquiries please feel free to reach out via email.</p>
<h2 style="font-size: 2em;">License</h2>
<p>The Fitlance application is open source and licensed under the MIT License.</p>

<pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
MIT License

Copyright (c) [year] Thomas Friedrichs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</pre>

<p>This license allows others to freely use, modify, and distribute the software.</p>
