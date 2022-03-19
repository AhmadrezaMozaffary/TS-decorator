interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[];
  };
}

const regValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  regValidators[target.constructor.name] = {
    [propName]: ["required"],
  };
}
function PosNo(target: any, propName: string) {
  regValidators[target.constructor.name] = {
    [propName]: ["positive"],
  };
}
function Validate(obj: any) {
  const objValidatorConfig = regValidators[obj.constructor.name];
  if (!objValidatorConfig) return true;
  let isValid = true;
  for (const prop in objValidatorConfig) {
    objValidatorConfig[prop].forEach((validator) => {
      switch (validator) {
        case "required":
          isValid = isValid && !!obj[prop];
          break;
        case "positive":
          isValid = isValid && obj[prop] > 0;
      }
    });
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PosNo
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector("form")!;
courseForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const titleEl = document.querySelector("#course-name")! as HTMLInputElement;
  const priceEl = document.querySelector("#price")! as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createCourse = new Course(title, price);

  if (!Validate(createCourse)) {
    const err = new Error("Invalid inputs!");
    alert(err.message);
    throw err;
  }

  console.log(createCourse);
});
