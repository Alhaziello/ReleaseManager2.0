# CarinaRM Project Analysis

Based on an analysis of the file structure and code, **CarinaRM** appears to be a Release Management (RM) tracking or CI/CD coordination web application built using the MEAN stack (MongoDB, Express, AngularJS, Node.js). The project uses Gulp and Bower for build processes and dependency management.

## Functionality Overview

This application serves as an internal tool to manage and track code deployments, versions, macros, programs, and error/incident tickets ("Serrcs") for different projects. Based on the API endpoints and frontend folder structure, its core functionalities include:

1. **Promote Management (Deployments/Releases)**
   - Tracks deployments and releases (Promotes).
   - Allows users to add, retrieve, update, and delete "Promotes".
   - Captures detailed rollout data for each "Promote" such as:
     - Jenkins Job IDs and Git SHAs.
     - Fallback options, fallback Git SHAs, and fallback Job IDs.
     - Tester names, job statuses, and changes in Service Now (`changeNumber`).
     - Specific metrics regarding dates (`promoteDate`, `loadDate`, `colsolDate`).
   - Links "Promotes" to lists of changed Programs and Macros.

2. **Serrc Management (Error/Issues/Incidents)**
   - Tracks specific issues or bugs utilizing "Serrc" numbers.
   - Saves program name, root cause, and the applied action for a specific Serrc.
   - Includes a bulk upload feature (`/chunk/serrc`) allowing administrators to upload thousands (1.5k - 3.5k) of "Serrc" items in a single action.

3. **Frontend Application**
   - Built via AngularJS, split into various modules/pages:
     - `promotes` (UI for viewing/editing promotes)
     - `serrcs` (UI for viewing/editing serrcs)
     - `admin` (Administrative management)
     - `home` (Dashboard overview)
     - `carina` (General components specific to CarinaRM)
     - `api` / `form` (Form handling layouts)

4. **Authentication & Identity (Commented out / In-Progress)**
   - The code shows traces (`node-sspi`, `express-ntlm`) of Microsoft Windows Authentication integrations to capture Active Directory groups and usernames mapping via the `Praveen.Kumar2@airnz.co.nz` domain (Air New Zealand). Those features appear partially disabled or used mostly for intranet enterprise deployment.

---

## Data Schemas

The application uses MongoDB as the database with Mongoose as the Object Data Modeling (ODM) library. There are two primary schemas powering the app data, located in `server/models/`.

### 1. Promote Schema (`promoteModel.js`)

A "Promote" essentially encapsulates a release or deployment package, storing arrays of sub-documents (Macros, Programs) and general deployment metadata.

```javascript
// Sub-schema: Macros involved in the promote
var subMacPromote = {
    macroName: String,
    promoteResponse: String,
    promoteTime: String
};

// Sub-schema: Programs involved in the promote
var subPgmPromote = {
    program: String,
    oldVersion: Number,
    newVersion: Number,
    promoteResponse: String,
    assemblyCc: String,
    promoteTime: String,
    programListing: String
};

// Sub-schema: The core data of a promote
var subPromoteData = {
    ticketNo: String,
    programmer: String,
    project: String,
    description: String,
    jenkinsJobId: Number,
    gitSha: String,
    testerName1: String,
    testerName2: String,
    specialRequirement: String,
    fallbackOption: String,
    loadModule: String,
    colsolMod: String,
    promoteDate: String,
    loadDate: String,
    changeNumber: String,
    colsolDate: String,
    note: String,
    jobStatus: String,
    fallbackDate: String,
    fbkGitSha: String,
    fbkJobId: Number,
    fbkNote: String
};

// Main Promote Schema
var promoteSchema = new Schema({
    PromoteMacroList: [ subMacPromote ],
    PromoteProgramList: [ subPgmPromote ],
    PromoteSheetData: [ subPromoteData ]
});
```

### 2. Serrc Schema (`serrcModel.js`)

A "Serrc" represents a recorded issue or incident linked to a specific program.

```javascript
// Main Serrc Schema
var serrcSchema = new Schema({
    // Unique identifier for the Serrc
    serrcNo: { type: String, unique: true, sparse: true, required: true },
    programName: { type: String, required: true },
    cause: String,
    action: String
});
```
