import type ModelClass from "@/model/modelClass";
import type Project from "@/model/project";
import type Property from "@/model/property";
import type Test from "@/model/test";

const exportVersionData = {
  currentVersion: "V1.0.0",
  "V1.0.0": {
    project: [
      { key: "name", types: ["string"], standard: "Nieuw project" },
      { key: "description", types: ["string", "null"], standard: null }
    ],
    modelClass: [
      { key: "name", types: ["string"], standard: "Nieuwe klasse" },
      { key: "hasCurrent", types: ["boolean"], standard: false },
      { key: "hasList", types: ["boolean"], standard: false }
    ],
    test: [
      { key: "happyRoad", types: ["boolean"], standard: false },
      { key: "testPath", types: ["string", "null"], standard: null },
      { key: "expectedResult", types: ["string", "null"], standard: null },
      { key: "testedResult", types: ["string", "null"], standard: null },
      { key: "succes", types: ["boolean", "null"], standard: false }
    ],
    property: [
      { key: "name", types: ["string"], standard: "Nieuw project" },
      { key: "type", types: ["string"], standard: "string" },
      { key: "nullable", types: ["boolean"], standard: false }
    ]
  }
};

export const exportFileHelper = {
  convertToExportFile(objects: Array<Project | ModelClass | Property | Test>): string {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `TestWrite-app project back-up; ${exportVersionData.currentVersion}\n`;

    const project = objects.shift() as Project;

    // @ts-ignore
    csvContent += `project;${exportVersionData[exportVersionData.currentVersion].project
      .map((objectProperty: { key: string; types: Array<string>; standaard: any }) => {
        // @ts-ignore
        return project[objectProperty.key];
      })
      .join(";")}\n`;

    for (const object of objects) {
      switch (typeof object as string) {
        case "ModelClass":
          // @ts-ignore
          csvContent += `modelClass;${exportVersionData[exportVersionData.currentVersion].project
            .map((objectProperty: { key: string; types: Array<string>; standaard: any }) => {
              // @ts-ignore
              return project[objectProperty.key];
            })
            .join(";")}\n`;
          break;
      }
    }

    return encodeURI(csvContent);
  },

  convertFromExportFile() {}
};
