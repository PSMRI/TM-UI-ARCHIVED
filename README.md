# AMRIT - Telemedicine (TM) Service

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![Build Status](https://github.com/PSMRI/TM-UI/actions/workflows/sast-and-package.yml/badge.svg)

The AMRIT Telemedicine (TM) Service enhances the capabilities of Health and Wellness Centers (HWCs) by providing remote healthcare services, improving accessibility, enabling collaborative care, and integrating with other facilities such as drug dispensing and laboratory services. This service aims to extend the reach and convenience of HWCs, ensuring that patients receive necessary medical advice and services without the need for in-person visits.

## Features of Telemedicine (TM)

Telemedicine plays a crucial role in the services provided by Health and Wellness Centers (HWCs). Here's how HWCs and telemedicine are connected:

1. **Teleconsultation**: HWCs utilize telemedicine technology to offer virtual consultations between patients and healthcare professionals. Through video calls, patients can connect with doctors and specialists to discuss their medical concerns, receive diagnoses, and obtain medical advice remotely, eliminating the need for in-person visits.

2. **Improved Accessibility**: Telemedicine in HWCs improves accessibility to healthcare services. Patients who face difficulties in traveling to the center, such as those residing in remote areas or with limited mobility, can conveniently access medical consultations and services from their own location.

3. **Outpatient Services**: HWCs primarily focus on outpatient services, catering to patients who do not require hospitalization. Telemedicine facilitates the delivery of these outpatient services by enabling virtual visits, follow-ups, and monitoring, eliminating the need for physical appointments.

4. **Medication Management**: Telemedicine can be integrated into the medication management process at HWCs. Doctors can remotely prescribe medications and provide necessary instructions to patients. Patients can then obtain their prescribed medications from the center's drug dispensing facility, ensuring a streamlined medication management process.

5. **Collaborative Care**: Telemedicine allows for collaboration between healthcare professionals within the HWC and specialists located in different locations. If a patient requires specialized expertise, telemedicine facilitates video consultations and discussions between the HWC's healthcare team and remote specialists, ensuring comprehensive care for the patient.

6. **Integration with Laboratory Services**: HWCs often have laboratory facilities for conducting diagnostic tests. Telemedicine can streamline this process by enabling remote monitoring and consultation regarding test results. For example, IoT devices in the laboratory can transmit test data directly to the HWC's application, facilitating seamless communication and interpretation of results during teleconsultations.

## Building From Source

This microservice is built using Java and the Spring Boot framework, with MySQL as the underlying database. Before building the TM module, ensure you have the following prerequisites:

- JDK 17
- Maven
- NPM/YARN
- Spring Boot V2
- MySQL

To build the TM module from source, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies and build the module:
   - Run the command `npm install`.
   - Run the command `npm run build`.
   - Run the command `mvn clean install`.
   - Run the command `npm start`.
3. Open your browser and access `http://localhost:4200/#/login` to view the login page of module.

## Usage

All the features of the TM module have been exposed as REST endpoints. For detailed information on how to use the service, refer to the SWAGGER API specification.

With the TM module, you can efficiently manage all aspects of your telemedicine application, ensuring seamless remote healthcare services for patients and collaboration among healthcare professionals.

## Building war files

To build deployable war files
```bash
mvn -B package --file pom.xml -P <profile_name>
```

The available profiles include dev, local, test, and ci.
Refer to `src/environments/environment.ci.template` file and ensure that the right environment variables are set for the build.

Packing with `ci` profile calls `build-ci` script in `package.json`.
It creates a `environment.ci.ts` file with all environment variables used in the generated build.
