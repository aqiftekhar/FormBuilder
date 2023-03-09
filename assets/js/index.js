var questions = 0;
const listControls = [
  "Select",
  "Input",
  "MultilineText",
  "Radio",
  "Checkbox",
  "Date",
  "YesNo",
  "IUnderstand",
  "SingleSelect",
  "MultiSelect",
  "Pathways",
  "Signature",
];
const inputTypesList = ["text", "name", "email", "phone", "number", "decimal"];
const listOptions = ["Option 1", "Option 2", "Option 3"];
const listOptionsYesNo = ["Yes", "No"];

var builder = [];
var jsonData = "";

const form_builder = document.getElementById("form_builder");
const form_submit = document.getElementById("btnSave");

const addDivElement = () => {
  questions++;
  const mainDiv = document.getElementById("div_drager");
  var element = document.createElement("div");
  var innerDiv = document.createElement("div");
  var inputGroup = document.createElement("div");
  var inputCheckBox = document.createElement("input");
  var selectGroup = document.createElement("div");
  var questionInput = document.createElement("input");
  var selectTag = document.createElement("select");
  var bodyWrapper = document.createElement("div");
  var footerWrapper = document.createElement("div");
  var actionWrapper = document.createElement("div");
  var requiredWrapper = document.createElement("div");
  var footerLabel = document.createElement("label");
  var formCheck = document.createElement("div");
  var imgDeleteWrapper = document.createElement("div");
  var imgDelete = document.createElement("i");
  let cardId = questions;
  let dbId = crypto.randomUUID();
  let card = "cardDiv_" + cardId;
  element.setAttribute("id", card);
  element.setAttribute("dbId", dbId)

  var input = document.createElement("input");
  let controlId = questions;
  let inputId = "inputControl_" + controlId;
  input.value = "Please enter question";
  input.setAttribute("id", inputId);
  input.setAttribute("style", "font-weight: bolder;");

  selectTag.id = "Select_" + controlId;

  let bodyWrapperId = "bodyWrapper_" + controlId;
  bodyWrapper.id = bodyWrapperId;

  element.setAttribute("class", "card p-3 my-3");
  innerDiv.setAttribute("class", "d-flex justify-content-between");
  inputGroup.setAttribute("class", "input-group input-group-outline");
  selectGroup.setAttribute("class", "select-group");
  questionInput.setAttribute("class", "question-input");
  questionInput.setAttribute("placeholder", "Question");
  questionInput.setAttribute("id", "Question_Input_" + controlId);
  selectTag.setAttribute("class", "select-control");
  bodyWrapper.setAttribute("class", "body-wrapper");
  actionWrapper.setAttribute("class", "action-wrapper");
  imgDelete.innerText = "delete"
  imgDeleteWrapper.setAttribute("class", "text-center me-2 d-flex align-items-center justify-content-center");
  imgDeleteWrapper.appendChild(imgDelete);
  imgDelete.setAttribute("class", "material-icons opacity-50");
  footerLabel.setAttribute("class", "footer-label");
  formCheck.setAttribute("class", "form-check form-switch ps-0");

  requiredWrapper.setAttribute(
      "class",
      "d-flex align-items-center required-wrapper"
  );
  footerWrapper.setAttribute(
      "class",
      "footer-wrapper d-flex justify-content-end align-items-center"
  );
  inputCheckBox.setAttribute("class", "form-check-input ms-auto");
  inputCheckBox.setAttribute("type", "checkbox");

  inputCheckBox.id = card + "_requiredId_" + controlId;
  inputCheckBox.disabled = true;
  inputCheckBox.checked = true;

  let object = {};
  object.cardId = card;
  object.inputId = inputId;
  object.questionId = questionInput.id;
  object.questionPlaceholder = questionInput.placeholder;
  object.selectTagId = selectTag.id;
  object.controlRequireId = inputCheckBox.id;
  object.bodyWrapperIdId = bodyWrapperId;
  object.isRequired = inputCheckBox.checked;
  object.dbId = dbId;
  builder.push(object);

  footerLabel.innerHTML = "Required";
  mainDiv.appendChild(element);
  element.appendChild(innerDiv);
  innerDiv.appendChild(inputGroup);
  inputGroup.appendChild(questionInput);
  innerDiv.appendChild(selectGroup);
  selectGroup.appendChild(selectTag);
  element.appendChild(bodyWrapper);
  element.appendChild(footerWrapper);
  footerWrapper.appendChild(actionWrapper);
  actionWrapper.appendChild(imgDeleteWrapper);
  footerWrapper.appendChild(requiredWrapper);
  requiredWrapper.appendChild(footerLabel);
  requiredWrapper.appendChild(formCheck);
  formCheck.appendChild(inputCheckBox);

  imgDelete.addEventListener("click", (e) => {
    deleteCard(e, element);
  });

  inputCheckBox.addEventListener("change", (e) => {
    object.isRequired = e.target.checked;
    RequiredChanged(e, bodyWrapper);
  });

  for (var i = 0; i < listControls.length; i++) {
    var option = document.createElement("option");
    option.value = listControls[i];
    option.text = listControls[i];
    selectTag.appendChild(option);
  }
  document.getElementById("div_drager").appendChild(element, false);

  input.focus();
  input.addEventListener("focusout", ElementHeaderInput, false);

  selectTag.addEventListener(
      "change",
      (e) => {
        selectItemChanged(e, bodyWrapperId, null, null);
      },
      false
  );
};
const deleteCard = (e, control) => {
  const shouldDelete = confirm("Do you really want to delete the selected question?\nBy deleting this question you will also be deleting all applicant responses to this question.");
  if (shouldDelete) {
    control.remove();
    let item = builder.find(
        (card) => card.cardId === e.target.parentNode.parentNode.parentNode.parentNode.id
    );
    let index = builder.indexOf(item);
    if (index > -1) {
      builder.splice(index, 1);
    }
  }
};

const RequiredChanged = (e, control) => {
  let option = control.parentNode.getElementsByTagName("select")[0];
  option.isRequired = e.target.checked
  if (e.target.checked) {
    if (option.value === "SingleSelect" || option.value === "MultiSelect") {
      let select = control.getElementsByTagName("select");
      if (select != null) {
        select[0].required = true;
        let index = builder.find(
            (card) =>
                card.cardId ===
                e.target.parentNode.parentNode.parentNode.parentNode.id
        );
        index.controls.control.forEach((element) => {
          element.isRequired = true;
        });
      }
    } else {
      let inputs = control.getElementsByTagName("input");
      if (inputs != null) {
        for (const item of inputs) {
          if (
              item.type === "radio" ||
              item.type === "text" ||
              item.type === "date" ||
              item.type === "email" ||
              item.type === "phone" ||
              item.type === "number" ||
              item.type === "decimal"
          ) {
            item.required = true;
            let index = builder.find(
                (card) =>
                    card.cardId ===
                    e.target.parentNode.parentNode.parentNode.parentNode.id
            );
            index.controls.control.forEach((element) => {
              element.isRequired = true;
            });
          } else if (item.type === "checkbox") {
            let parent = document.getElementById(item.name);
            parent.setAttribute("required", "required");
            let index = builder.find(
                (card) =>
                    card.cardId ===
                    e.target.parentNode.parentNode.parentNode.parentNode.id
            );
            index.controls.control.forEach((element) => {
              element.isRequired = true;
            });
            break;
          }
        }
      }

      let textArea = control.getElementsByTagName("textarea");

      if (textArea != null) {
        for (const item of textArea) {
          item.required = true;
          let index = builder.find(
              (card) =>
                  card.cardId ===
                  e.target.parentNode.parentNode.parentNode.parentNode.id
          );
          index.controls.control.forEach((element) => {
            element.isRequired = true;
          });
        }
      }
    }
  } else if (!e.target.checked) {

    if (option.value === "SingleSelect" || option.value === "MultiSelect") {
      let select = control.getElementsByTagName("select");
      if (select != null) {
        select[0].required = false;
        let index = builder.find(
            (card) =>
                card.cardId ===
                e.target.parentNode.parentNode.parentNode.parentNode.id
        );
        index.controls.control.forEach((element) => {
          element.isRequired = false;
        });
      }
    } else {
      let inputs = control.getElementsByTagName("input");
      if (inputs != null) {
        for (const item of inputs) {
          if (
              item.type === "radio" ||
              item.type === "text" ||
              item.type === "date" ||
              item.type === "email" ||
              item.type === "phone" ||
              item.type === "number" ||
              item.type === "decimal"
          ) {
            item.required = false;
            let index = builder.find(
                (card) =>
                    card.cardId ===
                    e.target.parentNode.parentNode.parentNode.parentNode.id
            );
            index.controls.control.forEach((element) => {
              element.isRequired = false;
            });
          } else if (item.type === "checkbox") {
            let parent = document.getElementById(item.name);
            parent.setAttribute("required", "required");
            let index = builder.find(
                (card) =>
                    card.cardId ===
                    e.target.parentNode.parentNode.parentNode.parentNode.id
            );
            index.controls.control.forEach((element) => {
              element.isRequired = false;
            });
            break;
          }
        }
      }

      let textArea = control.getElementsByTagName("textarea");

      if (textArea != null) {
        for (const item of textArea) {
          item.required = false;
          let index = builder.find(
              (card) =>
                  card.cardId ===
                  e.target.parentNode.parentNode.parentNode.parentNode.id
          );
          index.controls.control.forEach((element) => {
            element.isRequired = false;
          });
        }
      }
    }
  }
};

const ElementHeaderInput = (e) => {
  let parent = document.getElementById(e.target.parentNode.id);
  let replaceInputToLabel = document.getElementById(e.target.id);

  let label = document.createElement("label");
  label.id = e.target.id;
  label.setAttribute("style", "font-weight: bolder;");
  var newOption = document.createTextNode(e.target.value);

  label.appendChild(newOption);
  label.addEventListener("click", editOnLabelClick);
  parent.replaceChild(label, replaceInputToLabel);
};

const selectItemChanged = (e, bodyWrapperId, element) => {
  let i;
  if (e.target.value !== "select") {
    if (e.target.value === "Input") {
      if (element !== null) {
        if (element.controlType !== e.target.value) {
          element = null;
        }
      }

      let bodyWrapper = document.getElementById(bodyWrapperId);

      if (element === null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";

          if (e.target.className === "select-control validation") {
            e.target.setAttribute("class", "select-control");
          }

          if (bodyWrapper.className === "validation-wrapper") {
            bodyWrapper.setAttribute("class", "body-wrapper");
          }

          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          item.controls = {control: []};
          document.getElementById(item.controlRequireId).disabled = false;
        }
        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let inputDiv = document.createElement("div");

        inputDiv.setAttribute("class", "input-group input-group-outline");

        inputDiv.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id + "_divInput"
        );

        inputParentDiv.appendChild(inputDiv);

        bodyWrapper.appendChild(inputParentDiv);

        let getInputDiv = document.getElementById(
            e.target.parentNode.parentNode.parentNode.id + "_divInput"
        );
        let inputControl = document.createElement("input");
        inputControl.id = getInputDiv.id + "Input_" + 1;
        inputControl.type = "text";

        inputControl.setAttribute(
            "placeholder",
            "Please enter your answer here..."
        );
        inputControl.setAttribute("class", "user-input");

        getInputDiv.appendChild(inputControl);

        let inputTypes = document.createElement("select");

        inputTypes.id = inputControl.id + "_Input_Types_" + 1;

        for (i = 0; i < inputTypesList.length; i++) {
          let option = document.createElement("option");
          option.value = inputTypesList[i];
          option.text = inputTypesList[i];
          inputTypes.appendChild(option);
        }

        inputParentDiv.appendChild(inputTypes);

        inputTypes.addEventListener("change", (e) => {
          onInputTypeChange(e, inputControl);
        });

        let card = builder.find(
            (x) => x.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        card.controlType = "Input";
        card.hasControls = true;

        let controls = {control: []};
        let control = {};
        control.inputDivId =
            e.target.parentNode.parentNode.parentNode.id + "_divInput";
        control.inputControlId = inputControl.id;
        control.inputControlType = inputControl.type;
        control.placeholder = inputControl.placeholder;
        control.inputSelectId = inputTypes.id;
        control.dbId = inputControl.dbId;

        controls.control.push(control);

        let index = builder.find(
            (card) =>
                card.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        index.controls = controls;
      } else if (element != null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
        }

        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let inputDiv = document.createElement("div");

        inputDiv.setAttribute("class", "input-group input-group-outline");

        inputDiv.setAttribute("id", element.controls.control[0].inputDivId);

        inputParentDiv.appendChild(inputDiv);

        bodyWrapper.appendChild(inputParentDiv);

        let getInputDiv = document.getElementById(
            element.controls.control[0].inputDivId
        );
        let inputControl = document.createElement("input");
        inputControl.id = element.controls.control[0].inputControlId;
        inputControl.type = element.controls.control[0].inputControlType;

        inputControl.setAttribute(
            "placeholder",
            element.controls.control[0].placeholder
        );
        inputControl.setAttribute("class", "user-input");

        getInputDiv.appendChild(inputControl);

        let inputTypes = document.createElement("select");

        inputTypes.id = element.controls.control[0].inputSelectId;

        for (i = 0; i < inputTypesList.length; i++) {
          let option = document.createElement("option");
          option.value = inputTypesList[i];
          option.text = inputTypesList[i];
          if (element.controls.control[0].inputControlType === option.value) {
            option.selected = true;
          }
          inputTypes.appendChild(option);
        }

        inputParentDiv.appendChild(inputTypes);

        inputTypes.addEventListener("change", (e) => {
          onInputTypeChange(e, inputControl);
        });
      }
    } else if (e.target.value === "MultilineText") {
      if (element !== null) {
        if (element.controlType !== e.target.value) {
          element = null;
        }
      }
      let bodyWrapper = document.getElementById(bodyWrapperId);

      if (element == null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";

          if (e.target.className === "select-control validation") {
            e.target.setAttribute("class", "select-control");
          }

          if (bodyWrapper.className === "validation-wrapper") {
            bodyWrapper.setAttribute("class", "body-wrapper");
          }

          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.controlRequireId).disabled = false;
          if (item.controls !== undefined) {
            item.controls = {control: []};
          }
        }
        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let textAreaDiv = document.createElement("div");

        textAreaDiv.setAttribute("class", "input-group input-group-outline");
        textAreaDiv.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id + "_divMultilineInput"
        );

        inputParentDiv.appendChild(textAreaDiv);

        bodyWrapper.appendChild(inputParentDiv);

        let getMultiLineInputDiv = document.getElementById(
            e.target.parentNode.parentNode.parentNode.id + "_divMultilineInput"
        );
        let textAreaControl = document.createElement("textarea");
        textAreaControl.id = getMultiLineInputDiv.id + "textarea_" + 1;
        textAreaControl.setAttribute("class", "user-textarea");
        textAreaControl.setAttribute(
            "placeholder",
            "Please enter brief answer..."
        );
        getMultiLineInputDiv.appendChild(textAreaControl);

        let card = builder.find(
            (x) => x.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        card.controlType = "MultilineText";
        card.hasControls = true;

        let controls = {control: []};
        let control = {};
        control.inputDivId =
            e.target.parentNode.parentNode.parentNode.id + "_divMultilineInput";
        control.inputControlId = textAreaControl.id;
        control.inputControlType = textAreaControl.type;
        control.placeholder = textAreaControl.placeholder;
        controls.control.push(control);

        let index = builder.find(
            (card) =>
                card.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        index.controls = controls;
      } else if (element != null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
        }
        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let textAreaDiv = document.createElement("div");

        textAreaDiv.setAttribute("class", "input-group input-group-outline");
        textAreaDiv.setAttribute(
            "id",
            element.controls.control[0].inputDivId
        );

        inputParentDiv.appendChild(textAreaDiv);

        bodyWrapper.appendChild(inputParentDiv);

        let getMultiLineInputDiv = document.getElementById(
            element.controls.control[0].inputDivId
        );
        let textAreaControl = document.createElement("textarea");
        textAreaControl.id = element.controls.control[0].inputControlId;
        textAreaControl.setAttribute("class", "user-textarea");
        textAreaControl.setAttribute(
            "placeholder",
            element.controls.control[0].placeholder
        );
        getMultiLineInputDiv.appendChild(textAreaControl);
      }
    } else if (e.target.value === "Radio") {
      if (element !== null) {
        if (element.controlType !== e.target.value) {
          element = null;
        }
      }
      let bodyWrapper = document.getElementById(bodyWrapperId);

      if (element === null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";

          if (e.target.className === "select-control validation") {
            e.target.setAttribute("class", "select-control");
          }

          if (bodyWrapper.className === "validation-wrapper") {
            bodyWrapper.setAttribute("class", "body-wrapper");
          }

          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          item.controls = {control: []};
          document.getElementById(item.controlRequireId).disabled = false;
        }

        let hiddenIndexLabel = document.createElement("input");

        hiddenIndexLabel.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id + "_hiddenIndexLabel"
        );
        bodyWrapper.appendChild(hiddenIndexLabel);
        hiddenIndexLabel.setAttribute("type", "hidden");

        for (let index = 0; index <= listOptions.length; index++) {
          let radioParentDiv = document.createElement("div");

          radioParentDiv.setAttribute(
              "class",
              "d-flex justify-content-between py-2"
          );

          let radioDiv = document.createElement("div");

          radioDiv.setAttribute("class", "d-flex align-item-center w-100");
          radioDiv.setAttribute(
              "id",
              e.target.parentNode.parentNode.parentNode.id + "_divRadio_" + index
          );
          radioDiv.setAttribute("dbId", crypto.randomUUID());

          radioParentDiv.appendChild(radioDiv);

          bodyWrapper.appendChild(radioParentDiv);

          let getDiv = document.getElementById(
              e.target.parentNode.parentNode.parentNode.id + "_divRadio_" + index
          );
          let input = document.createElement("input");
          input.type = "Radio";
          input.name = bodyWrapper.id;
          input.id = getDiv.id + "_radio_" + index;
          let dbId = crypto.randomUUID()
          input.setAttribute("dbId", dbId)
          let label = document.createElement("label");
          label.id = getDiv.id + "Option_" + index;

          let textYes = document.createTextNode(listOptions[index]);

          let removeButton = document.createElement("button");

          removeButton.setAttribute(
              "id",
              e.target.parentNode.parentNode.parentNode.id + "_remove_" + index
          );
          removeButton.innerHTML = "x";
          removeButton.setAttribute("class", "btn-remove");

          if (index < listOptions.length) {
            label.appendChild(textYes);
            getDiv.appendChild(input);
            getDiv.appendChild(label);
            getDiv.appendChild(removeButton);
            label.setAttribute("class", "radio-label");
            label.addEventListener("click", (e) => {
              editRadioOnClick(e, removeButton);
            });
            removeButton.addEventListener("click", (e) => {
              deleteRadioElement(e, removeButton);
            });

            hiddenIndexLabel.value = index + 1;

            let card = builder.find(
                (x) => x.cardId === e.target.parentNode.parentNode.parentNode.id
            );
            card.controlType = "Radio";
            card.hasControls = true;
            card.hiddenIndex = hiddenIndexLabel.value;
            let controls = {control: []};

            let control = {};
            control.selectDivId =
                e.target.parentNode.parentNode.parentNode.id +
                "_divRadio_" +
                index;
            control.selectControlId = input.id;
            control.selectControlType = input.type;
            control.placeholder = input.placeholder;
            control.lastIndex = hiddenIndexLabel.value;

            control.text = label.innerHTML;

            control.labelId = label.id;
            control.label_type = label.tagName;
            control.dbId = dbId;

            controls.control.push(control);

            let item = builder.find(
                (card) =>
                    card.cardId === e.target.parentNode.parentNode.parentNode.id
            );

            if (item.controls === undefined) {
              item.controls = {};
              item.controls = controls;
            } else {
              item.controls.control.push(controls.control[0]);
            }
          } else {
            let link = document.createElement("a");
            link.text = "Add Another";
            link.href = "#";
            link.id = getDiv.id + "_AddNewOption_" + index;
            link.setAttribute("class", "new-radio-option");
            getDiv.appendChild(link);
            link.addEventListener("click", (e) => {
              AddNewOption(
                  e,
                  "Radio",
                  getDiv,
                  radioDiv,
                  index,
                  hiddenIndexLabel
              );
            });
          }
        }
      } else if (element !== null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
        }
        let hiddenIndexLabel = document.createElement("input");

        hiddenIndexLabel.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id + "_hiddenIndexLabel"
        );
        bodyWrapper.appendChild(hiddenIndexLabel);
        hiddenIndexLabel.setAttribute("type", "hidden");

        for (let index = 0; index <= element.controls.control.length; index++) {
          let radioParentDiv = document.createElement("div");

          radioParentDiv.setAttribute(
              "class",
              "d-flex justify-content-between py-2"
          );

          let radioDiv = document.createElement("div");

          radioDiv.setAttribute("class", "d-flex align-item-center w-100");

          if (index < element.controls.control.length) {
            radioDiv.setAttribute(
                "id",
                element.controls.control[index].selectDivId
            );
          } else {
            radioDiv.setAttribute(
                "id",
                e.target.parentNode.parentNode.parentNode.id +
                "_divRadio_NewOption_" +
                index
            );
          }

          radioParentDiv.appendChild(radioDiv);

          bodyWrapper.appendChild(radioParentDiv);
          let getDiv;
          if (index < element.controls.control.length) {
            getDiv = document.getElementById(
                element.controls.control[index].selectDivId
            );
          } else {
            getDiv = document.getElementById(
                e.target.parentNode.parentNode.parentNode.id +
                "_divRadio_NewOption_" +
                index
            );
          }

          if (index < element.controls.control.length) {
            let input = document.createElement("input");
            input.type = "Radio";
            input.name = bodyWrapper.id;
            input.id = element.controls.control[index].selectControlId;
            let dbId;
            if (element.controls.control[index].dbId) {
              dbId = element.controls.control[index].dbId;
            } else {
              dbId = crypto.randomUUID();
              element.controls.control[index].dbId = dbId
            }
            input.setAttribute("dbId", dbId)
            input.dbId = dbId
            let label = document.createElement("label");
            label.id = element.controls.control[index].labelId;

            let removeButton = document.createElement("button");

            removeButton.setAttribute(
                "id",
                e.target.parentNode.parentNode.parentNode.id + "_remove_" + index
            );
            removeButton.innerHTML = "x";
            removeButton.setAttribute("class", "btn-remove");
            let textYes = document.createTextNode(
                element.controls.control[index].text
            );
            label.appendChild(textYes);
            getDiv.appendChild(input);
            getDiv.appendChild(label);
            getDiv.appendChild(removeButton);
            label.setAttribute("class", "radio-label");
            label.addEventListener("click", (e) => {
              editRadioOnClick(e, removeButton);
            });
            removeButton.addEventListener("click", (e) => {
              deleteRadioElement(e, removeButton);
            });
          } else {
            let link = document.createElement("a");
            link.text = "Add Another";
            link.href = "#";
            link.id = getDiv.id + "_AddNewOption_" + index;
            link.setAttribute("class", "new-radio-option");
            getDiv.appendChild(link);
            link.addEventListener("click", (e) => {
              AddNewOption(
                  e,
                  "Radio",
                  getDiv,
                  radioDiv,
                  index,
                  hiddenIndexLabel
              );
            });
          }
        }
      }
    } else if (e.target.value === "Checkbox") {
      if (element !== null) {
        if (element.controlType != e.target.value) {
          element = null;
        }
      }
      let bodyWrapper = document.getElementById(bodyWrapperId);

      if (element === null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";

          if (e.target.className === "select-control validation") {
            e.target.setAttribute("class", "select-control");
          }

          if (bodyWrapper.className === "validation-wrapper") {
            bodyWrapper.setAttribute("class", "body-wrapper");
          }

          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          item.controls = {control: []};
          document.getElementById(item.controlRequireId).disabled = false;
        }

        let hiddenIndexLabel = document.createElement("input");

        hiddenIndexLabel.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id + "_hiddenIndexLabel"
        );
        bodyWrapper.appendChild(hiddenIndexLabel);
        hiddenIndexLabel.setAttribute("type", "hidden");

        for (let index = 0; index <= listOptions.length; index++) {
          let checkboxParentDiv = document.createElement("div");

          checkboxParentDiv.setAttribute(
              "class",
              "d-flex justify-content-between py-2"
          );

          let checkboxDiv = document.createElement("div");
          checkboxDiv.setAttribute("dbId", crypto.randomUUID());

          checkboxDiv.setAttribute("class", "d-flex align-item-center w-100");
          checkboxDiv.setAttribute(
              "id",
              e.target.parentNode.parentNode.parentNode.id +
              "_divCheckbox_" +
              index
          );

          checkboxParentDiv.appendChild(checkboxDiv);

          bodyWrapper.appendChild(checkboxParentDiv);

          let getCheckboxDiv = document.getElementById(
              e.target.parentNode.parentNode.parentNode.id +
              "_divCheckbox_" +
              index
          );
          let input = document.createElement("input");
          input.type = "checkbox";
          input.name = bodyWrapper.id;
          input.id = getCheckboxDiv.id + "_checkbox_" + index;
          let dbId = crypto.randomUUID()
          input.setAttribute("dbId", dbId)
          input.db = dbId
          let label = document.createElement("label");
          label.id = getCheckboxDiv.id + "_checkboxOption_" + index;

          let textYes = document.createTextNode(listOptions[index]);

          let removeButton = document.createElement("button");

          removeButton.setAttribute(
              "id",
              e.target.parentNode.parentNode.parentNode.id + "_remove_" + index
          );
          removeButton.innerHTML = "x";
          removeButton.setAttribute("class", "btn-remove");

          if (index < listOptions.length) {
            label.appendChild(textYes);
            getCheckboxDiv.appendChild(input);
            getCheckboxDiv.appendChild(label);
            getCheckboxDiv.appendChild(removeButton);
            label.setAttribute("class", "radio-label");
            label.addEventListener("click", (e) => {
              editRadioOnClick(e, removeButton);
            });
            removeButton.addEventListener("click", (e) => {
              deleteRadioElement(e, removeButton);
            });

            hiddenIndexLabel.value = index + 1;

            let card = builder.find(
                (x) => x.cardId === e.target.parentNode.parentNode.parentNode.id
            );
            card.controlType = "Checkbox";
            card.hasControls = true;
            card.hiddenIndex = hiddenIndexLabel.value;

            let controls = {control: []};

            let control = {};
            control.selectDivId =
                e.target.parentNode.parentNode.parentNode.id +
                "_divCheckbox_" +
                index;
            control.selectControlId = input.id;
            control.selectControlType = input.type;
            control.placeholder = input.placeholder;
            control.dbId = dbId

            control.text = label.innerHTML;

            control.labelId = label.id;
            control.label_type = label.tagName;

            controls.control.push(control);

            let item = builder.find(
                (card) =>
                    card.cardId === e.target.parentNode.parentNode.parentNode.id
            );

            if (item.controls === undefined) {
              item.controls = {};
              item.controls = controls;
            } else {
              item.controls.control.push(controls.control[0]);
            }
          } else {
            let link = document.createElement("a");
            link.text = "Add Another";
            link.href = "#";
            link.id = getCheckboxDiv.id + "_AddNewOption_" + index;
            link.setAttribute("class", "new-radio-option");
            getCheckboxDiv.appendChild(link);
            link.addEventListener("click", (e) => {
              AddNewOption(
                  e,
                  "Checkbox",
                  getCheckboxDiv,
                  checkboxDiv,
                  index,
                  hiddenIndexLabel
              );
            });
          }
        }
      } else if (element !== null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
        }
        let hiddenIndexLabel = document.createElement("input");

        hiddenIndexLabel.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id + "_hiddenIndexLabel"
        );
        bodyWrapper.appendChild(hiddenIndexLabel);
        hiddenIndexLabel.setAttribute("type", "hidden");

        for (let index = 0; index <= element.controls.control.length; index++) {
          let checkboxParentDiv = document.createElement("div");

          checkboxParentDiv.setAttribute(
              "class",
              "d-flex justify-content-between py-2"
          );

          let checkboxDiv = document.createElement("div");

          checkboxDiv.setAttribute("class", "d-flex align-item-center w-100");

          if (index < element.controls.control.length) {
            checkboxDiv.setAttribute(
                "id",
                element.controls.control[index].selectDivId
            );
          } else {
            checkboxDiv.setAttribute(
                "id",
                e.target.parentNode.parentNode.parentNode.id +
                "_divCheckbox_NewOption_" +
                index
            );
          }

          checkboxParentDiv.appendChild(checkboxDiv);

          bodyWrapper.appendChild(checkboxParentDiv);

          let getCheckboxDiv;

          if (index < element.controls.control.length) {
            getCheckboxDiv = document.getElementById(
                element.controls.control[index].selectDivId
            );
          } else {
            getCheckboxDiv = document.getElementById(
                e.target.parentNode.parentNode.parentNode.id +
                "_divCheckbox_NewOption_" +
                index
            );
          }

          if (index < element.controls.control.length) {
            let input = document.createElement("input");
            input.type = "checkbox";
            input.name = bodyWrapper.id;
            input.id = element.controls.control[index].selectControlId;
            let label = document.createElement("label");
            label.id = element.controls.control[index].labelId;
            let dbId;
            if (element.controls.control[index].dbId) {
              dbId = element.controls.control[index].dbId;
            } else {
              dbId = crypto.randomUUID();
              element.controls.control[index].dbId = dbId
            }
            input.setAttribute("dbId", dbId)
            input.dbId = dbId

            let textYes = document.createTextNode(
                element.controls.control[index].text
            );

            let removeButton = document.createElement("button");

            removeButton.setAttribute(
                "id",
                e.target.parentNode.parentNode.parentNode.id + "_remove_" + index
            );
            removeButton.innerHTML = "x";
            removeButton.setAttribute("class", "btn-remove");
            label.appendChild(textYes);
            getCheckboxDiv.appendChild(input);
            getCheckboxDiv.appendChild(label);
            getCheckboxDiv.appendChild(removeButton);
            label.setAttribute("class", "radio-label");
            label.addEventListener("click", (e) => {
              editRadioOnClick(e, removeButton);
            });
            removeButton.addEventListener("click", (e) => {
              deleteRadioElement(e, removeButton);
            });

            hiddenIndexLabel.value = index + 1;
          } else {
            let link = document.createElement("a");
            link.text = "Add Another";
            link.href = "#";
            link.id = getCheckboxDiv.id + "_AddNewOption_" + index;
            link.setAttribute("class", "new-radio-option");
            getCheckboxDiv.appendChild(link);
            link.addEventListener("click", (e) => {
              AddNewOption(
                  e,
                  "Checkbox",
                  getCheckboxDiv,
                  checkboxDiv,
                  index,
                  hiddenIndexLabel
              );
            });
          }
        }
      }
    } else if (e.target.value === "SingleSelect") {
      if (element !== null) {
        if (element.controlType != e.target.value) {
          element = null;
        }
      }

      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (element === null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";

          if (e.target.className === "select-control validation") {
            e.target.setAttribute("class", "select-control");
          }

          if (bodyWrapper.className === "validation-wrapper") {
            bodyWrapper.setAttribute("class", "body-wrapper");
          }

          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.controlRequireId).disabled = false;
          item.controls = {control: []};
        }

        let selectParentDiv = document.createElement("div");
        selectParentDiv.setAttribute("class", "d-flex justify-content-between");

        let selectDiv = document.createElement("div");

        selectDiv.setAttribute("class", "input-group input-group-outline");
        selectDiv.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id + "_divSelect"
        );

        selectParentDiv.appendChild(selectDiv);

        bodyWrapper.appendChild(selectParentDiv);

        let selectInputParentDiv = document.createElement("div");
        selectInputParentDiv.setAttribute(
            "class",
            "d-flex justify-content-between my-4"
        );

        let inputDiv = document.createElement("div");
        inputDiv.setAttribute("class", "input-group input-group-outline");
        inputDiv.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id + "_divInputSelect"
        );
        selectInputParentDiv.appendChild(inputDiv);
        bodyWrapper.appendChild(selectInputParentDiv);

        let getInputSelectDiv = document.getElementById(
            e.target.parentNode.parentNode.parentNode.id + "_divInputSelect"
        );
        let inputControl = document.createElement("input");
        inputControl.id = getInputSelectDiv.id + "_selectInput_" + 1;
        inputControl.setAttribute("class", "user-input");
        inputControl.setAttribute(
            "placeholder",
            "Please enter options and press Enter..."
        );
        getInputSelectDiv.appendChild(inputControl);

        let getSelectDiv = document.getElementById(
            e.target.parentNode.parentNode.parentNode.id + "_divSelect"
        );

        let selectControl = document.createElement("select");
        selectControl.id = getSelectDiv.id + "_select_" + 1;
        selectControl.setAttribute("class", "user-input");
        selectControl.setAttribute(
            "placeholder",
            "Please enter your answere here..."
        );
        getSelectDiv.appendChild(selectControl);

        inputControl.addEventListener("keypress", (e) => {
          enterItemToDropDownList(e, selectControl);
        });

        let card = builder.find(
            (x) => x.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        card.controlType = "SingleSelect";
        card.hasControls = true;

        let controls = {control: []};

        let control = {};
        control.select_div = selectDiv.id;
        control.select_input_div = inputDiv.id;
        control.select_inputcontrol_div = inputControl.id;
        control.selectControlId = selectControl.id;
        control.selectControlType = selectControl.type;
        control.placeholder = inputControl.placeholder;

        control.options = {option: []};

        controls.control.push(control);

        let index = builder.find(
            (card) =>
                card.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        index.controls = controls;
      } else if (element !== null) {
        let selectParentDiv = document.createElement("div");
        selectParentDiv.setAttribute("class", "d-flex justify-content-between");

        let selectDiv = document.createElement("div");

        selectDiv.setAttribute("class", "input-group input-group-outline");
        selectDiv.setAttribute("id", element.controls.control[0].select_div);

        selectParentDiv.appendChild(selectDiv);

        bodyWrapper.appendChild(selectParentDiv);

        let selectInputParentDiv = document.createElement("div");
        selectInputParentDiv.setAttribute(
            "class",
            "d-flex justify-content-between my-4"
        );

        let inputDiv = document.createElement("div");
        inputDiv.setAttribute("class", "input-group input-group-outline");
        inputDiv.setAttribute(
            "id",
            element.controls.control[0].select_input_div
        );
        selectInputParentDiv.appendChild(inputDiv);
        bodyWrapper.appendChild(selectInputParentDiv);

        let getInputSelectDiv = document.getElementById(
            element.controls.control[0].select_input_div
        );
        let inputControl = document.createElement("input");
        inputControl.id = element.controls.control[0].select_inputcontrol_div;
        inputControl.setAttribute("class", "user-input");
        inputControl.setAttribute(
            "placeholder",
            element.controls.control[0].placeholder
        );
        getInputSelectDiv.appendChild(inputControl);

        let getSelectDiv = document.getElementById(
            element.controls.control[0].select_div
        );

        let selectControl = document.createElement("select");
        selectControl.id = element.controls.control[0].selectControlId;
        selectControl.setAttribute("class", "user-input");
        selectControl.setAttribute(
            "placeholder",
            "Please enter your answere here..."
        );
        getSelectDiv.appendChild(selectControl);

        element.controls.control[0].options.option.forEach((item) => {
          let option = document.createElement("option");
          option.value = item.option_value;
          option.text = item.option_text;
          option.disabled = item.option_disabled;
          option.selected = item.option_selected;
          let dbId;
          if (item.dbId) {
            dbId = item.dbId;
          } else {
            dbId = crypto.randomUUID();
            option.dbId = dbId;
            item.dbId = dbId
          }
          option.setAttribute("dbId", dbId);

          selectControl.appendChild(option);
        });

        inputControl.addEventListener("keypress", (e) => {
          enterItemToDropDownList(e, selectControl);
        });
      }
    } else if (e.target.value === "Signature") {
      if (element !== null) {
        if (element.controlType != e.target.value) {
          element = null;
        }
      }

      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (element === null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";

          if (e.target.className === "select-control validation") {
            e.target.setAttribute("class", "select-control");
          }

          if (bodyWrapper.className === "validation-wrapper") {
            bodyWrapper.setAttribute("class", "body-wrapper");
          }

          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.controlRequireId).disabled = false;
          item.controls = {control: []};
        }

        let descriptionDiv = document.createElement("p");
        descriptionDiv.innerText = "A signature will be collected"
        bodyWrapper.appendChild(descriptionDiv)


        let card = builder.find(
            (x) => x.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        card.controlType = "Signature";

      }
    } else if (e.target.value === "Pathways") {
      if (element !== null) {
        if (element.controlType != e.target.value) {
          element = null;
        }
      }

      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (element === null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";

          if (e.target.className === "select-control validation") {
            e.target.setAttribute("class", "select-control");
          }

          if (bodyWrapper.className === "validation-wrapper") {
            bodyWrapper.setAttribute("class", "body-wrapper");
          }

          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.controlRequireId).disabled = false;
          item.controls = {control: []};
        }

        let descriptionDiv = document.createElement("p");
        descriptionDiv.innerText = "Students will be able to select a single pathway."
        bodyWrapper.appendChild(descriptionDiv)


        let card = builder.find(
            (x) => x.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        card.controlType = "Pathways";

      }
    } else if (e.target.value === "Date") {
      if (element !== null) {
        if (element.controlType != e.target.value) {
          element = null;
        }
      }
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (element === null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
          if (e.target.className === "select-control validation") {
            e.target.setAttribute("class", "select-control");
          }

          if (bodyWrapper.className === "validation-wrapper") {
            bodyWrapper.setAttribute("class", "body-wrapper");
          }
          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.controlRequireId).disabled = false;
          item.controls = {control: []};
        }
        let dateParentDiv = document.createElement("div");
        dateParentDiv.setAttribute("class", "d-flex justify-content-between");

        let dateDiv = document.createElement("div");

        dateDiv.setAttribute("class", "input-group input-group-outline");
        dateDiv.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id + "_divDateTime"
        );

        dateParentDiv.appendChild(dateDiv);

        bodyWrapper.appendChild(dateParentDiv);

        let getDateDiv = document.getElementById(
            e.target.parentNode.parentNode.parentNode.id + "_divDateTime"
        );
        let inputDateControl = document.createElement("input");
        inputDateControl.id = getDateDiv.id + "dateInput_" + 1;
        inputDateControl.type = "date";
        inputDateControl.setAttribute("class", "user-input");
        inputDateControl.setAttribute(
            "placeholder",
            "Please enter your answere here..."
        );
        getDateDiv.appendChild(inputDateControl);

        let card = builder.find(
            (x) => x.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        card.controlType = "Date";
        card.hasControls = true;

        let controls = {control: []};
        let control = {};
        control.inputDivId =
            e.target.parentNode.parentNode.parentNode.id + "_divDateTime";
        control.inputControlId = inputDateControl.id;
        control.inputControlType = inputDateControl.type;
        control.placeholder = inputDateControl.placeholder;
        controls.control.push(control);

        let index = builder.find(
            (card) =>
                card.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        index.controls = controls;
      } else if (element !== null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
        }
        let dateParentDiv = document.createElement("div");
        dateParentDiv.setAttribute("class", "d-flex justify-content-between");

        let dateDiv = document.createElement("div");

        dateDiv.setAttribute("class", "input-group input-group-outline");
        dateDiv.setAttribute("id", element.controls.control[0].inputDivId);

        dateParentDiv.appendChild(dateDiv);

        bodyWrapper.appendChild(dateParentDiv);

        let getDateDiv = document.getElementById(
            element.controls.control[0].inputDivId
        );
        let inputDateControl = document.createElement("input");
        inputDateControl.id = element.controls.control[0].inputControlId;
        inputDateControl.type = element.controls.control[0].inputControlType;
        inputDateControl.setAttribute("class", "user-input");
        inputDateControl.setAttribute(
            "placeholder",
            element.controls.control[0].placeholder
        );
        getDateDiv.appendChild(inputDateControl);
      }
    } else if (e.target.value === "Time") {
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (bodyWrapper != null) {
        bodyWrapper.innerHTML = "";
      }
      let timeParentDiv = document.createElement("div");
      timeParentDiv.setAttribute("class", "d-flex justify-content-between");

      let timeDiv = document.createElement("div");

      timeDiv.setAttribute("class", "input-group input-group-outline");
      timeDiv.setAttribute(
          "id",
          e.target.parentNode.parentNode.parentNode.id + "_divDateTime"
      );

      timeParentDiv.appendChild(timeDiv);

      bodyWrapper.appendChild(timeParentDiv);

      let getTimeDiv = document.getElementById(
          e.target.parentNode.parentNode.parentNode.id + "_divDateTime"
      );
      let inputTimeControl = document.createElement("input");
      inputTimeControl.id = getTimeDiv.id + "dateInput_" + 1;
      inputTimeControl.type = "time";
      inputTimeControl.setAttribute("class", "user-input");
      inputTimeControl.setAttribute(
          "placeholder",
          "Please enter your answere here..."
      );
      getTimeDiv.appendChild(inputTimeControl);
    } else if (e.target.value === "YesNo") {
      if (element !== null) {
        if (element.controlType != e.target.value) {
          element = null;
        }
      }
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (element === null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
          if (e.target.className === "select-control validation") {
            e.target.setAttribute("class", "select-control");
          }

          if (bodyWrapper.className === "validation-wrapper") {
            bodyWrapper.setAttribute("class", "body-wrapper");
          }
          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.controlRequireId).disabled = false;
          item.controls = {control: []};
        }

        for (let index = 0; index < listOptionsYesNo.length; index++) {
          let radioYesNoParentDiv = document.createElement("div");

          radioYesNoParentDiv.setAttribute(
              "class",
              "d-flex justify-content-between py-2"
          );

          let radioYesNoDiv = document.createElement("div");

          radioYesNoDiv.setAttribute("class", "d-flex align-item-center w-100");
          radioYesNoDiv.setAttribute(
              "id",
              e.target.parentNode.parentNode.parentNode.id +
              "_divRadioYesNo_" +
              index
          );

          radioYesNoParentDiv.appendChild(radioYesNoDiv);

          bodyWrapper.appendChild(radioYesNoParentDiv);

          let getRadioYesNoDiv = document.getElementById(
              e.target.parentNode.parentNode.parentNode.id +
              "_divRadioYesNo_" +
              index
          );
          let input = document.createElement("input");
          input.type = "Radio";
          input.name = bodyWrapper.id;
          input.id = getRadioYesNoDiv.id + "_radio_" + index;
          let label = document.createElement("label");
          label.id = getRadioYesNoDiv.id + "Option_" + index;
          let dbId = crypto.randomUUID()
          input.setAttribute("dbId", dbId)

          let textYes = document.createTextNode(listOptionsYesNo[index]);

          label.appendChild(textYes);
          getRadioYesNoDiv.appendChild(input);
          getRadioYesNoDiv.appendChild(label);
          label.setAttribute("class", "radio-label-YesNo");

          let card = builder.find(
              (x) => x.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          card.controlType = "YesNo";
          card.hasControls = true;

          let controls = {control: []};

          let control = {};
          control.selectDivId = radioYesNoDiv.id;
          control.selectControlId = input.id;
          control.selectControlType = input.type;
          control.select_labelId = label.id;
          control.placeholder = input.placeholder;
          control.dbId = dbId

          control.text = label.innerHTML;

          control.labelId = label.id;
          control.label_type = label.tagName;

          controls.control.push(control);

          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );

          if (item.controls === undefined) {
            item.controls = {};
            item.controls = controls;
          } else {
            item.controls.control.push(controls.control[0]);
          }
        }
      } else if (element !== null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
        }

        for (let index = 0; index < element.controls.control.length; index++) {
          let radioYesNoParentDiv = document.createElement("div");

          radioYesNoParentDiv.setAttribute(
              "class",
              "d-flex justify-content-between py-2"
          );

          let radioYesNoDiv = document.createElement("div");

          radioYesNoDiv.setAttribute("class", "d-flex align-item-center w-100");
          radioYesNoDiv.setAttribute(
              "id",
              element.controls.control[index].selectDivId
          );

          radioYesNoParentDiv.appendChild(radioYesNoDiv);

          bodyWrapper.appendChild(radioYesNoParentDiv);

          let getRadioYesNoDiv = document.getElementById(
              element.controls.control[index].selectDivId
          );
          let input = document.createElement("input");
          input.type = "Radio";
          input.name = bodyWrapper.id;
          input.id = element.controls.control[index].selectControlId;
          let label = document.createElement("label");
          label.id = element.controls.control[index].select_labelId;
          let dbId;
          if (element.controls.control[index].dbId) {
            dbId = element.controls.control[index].dbId;
          } else {
            dbId = crypto.randomUUID();
            element.controls.control[index].dbId = dbId
          }
          input.setAttribute("dbId", dbId)

          let textYes = document.createTextNode(
              element.controls.control[index].text
          );

          label.appendChild(textYes);
          getRadioYesNoDiv.appendChild(input);
          getRadioYesNoDiv.appendChild(label);
          label.setAttribute("class", "radio-label-YesNo");
        }
      }
    } else if (e.target.value === "IUnderstand") {
      if (element !== null) {
        if (element.controlType != e.target.value) {
          element = null;
        }
      }
      let bodyWrapper = document.getElementById(bodyWrapperId);

      if (element === null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
          if (e.target.className === "select-control validation") {
            e.target.setAttribute("class", "select-control");
          }

          if (bodyWrapper.className === "validation-wrapper") {
            bodyWrapper.setAttribute("class", "body-wrapper");
          }
          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.controlRequireId).disabled = false;
          item.controls = {control: []};
        }

        let chkConsentParentDiv = document.createElement("div");

        chkConsentParentDiv.setAttribute(
            "class",
            "d-flex justify-content-between py-2"
        );

        let chkConsentDiv = document.createElement("div");

        chkConsentDiv.setAttribute("class", "d-flex align-item-center w-100");
        chkConsentDiv.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id +
            "_divCheckbox_Iunderstand"
        );

        chkConsentParentDiv.appendChild(chkConsentDiv);

        bodyWrapper.appendChild(chkConsentParentDiv);

        let getChkConsentDiv = document.getElementById(
            e.target.parentNode.parentNode.parentNode.id +
            "_divCheckbox_Iunderstand"
        );
        let input = document.createElement("input");
        input.type = "checkbox";
        input.name = bodyWrapper.id;
        input.id = getChkConsentDiv.id + "_checkbox_Iunderstand";
        let label = document.createElement("label");
        label.id = getChkConsentDiv.id + "_checkboxOption_Iunderstand";
        let dbId = crypto.randomUUID()
        input.dbId = dbId
        input.disabled = true
        input.setAttribute("dbId", dbId)

        let textYes = document.createTextNode(
            "I understand"
        );

        label.appendChild(textYes);
        getChkConsentDiv.appendChild(input);
        getChkConsentDiv.appendChild(label);
        label.setAttribute("class", "radio-label");

        let card = builder.find(
            (x) => x.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        card.controlType = "IUnderstand";
        card.hasControls = true;

        let controls = {control: []};
        let control = {};
        control.selectDivId = chkConsentDiv.id;
        control.inputControlId = input.id;
        control.inputControlType = input.type;
        control.input_placeholder = input.placeholder;
        control.dbId = dbId;

        control.label_i_understand = label.innerHTML;
        control.text = label.innerHTML;

        control.labelId = label.id;
        control.dbId = crypto.randomUUID();

        controls.control.push(control);

        let index = builder.find(
            (card) =>
                card.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        index.controls = controls;
      } else if (element !== null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
        }

        let chkConsentParentDiv = document.createElement("div");

        chkConsentParentDiv.setAttribute(
            "class",
            "d-flex justify-content-between py-2"
        );

        let chkConsentDiv = document.createElement("div");

        chkConsentDiv.setAttribute("class", "d-flex align-item-center w-100");
        chkConsentDiv.setAttribute(
            "id",
            element.controls.control[0].selectDivId
        );

        chkConsentParentDiv.appendChild(chkConsentDiv);

        bodyWrapper.appendChild(chkConsentParentDiv);

        let getChkConsentDiv = document.getElementById(
            element.controls.control[0].selectDivId
        );
        let input = document.createElement("input");
        input.type = "checkbox";
        input.name = bodyWrapper.id;
        input.id = element.controls.control[0].inputControlId;
        input.disabled = true
        let dbId;
        if (element.controls.control[0].dbId) {
          dbId = element.controls.control[0].dbId
        } else {
          dbId = crypto.randomUUID()
          element.controls.control[0].dbId = dbId
        }
        input.dbId = dbId
        input.setAttribute("dbId", dbId)
        let label = document.createElement("label");
        label.id = element.controls.control[0].labelId;
        label.disabled = true

        let textYes = document.createTextNode(element.controls.control[0].text);

        label.appendChild(textYes);
        getChkConsentDiv.appendChild(input);
        getChkConsentDiv.appendChild(label);
        label.setAttribute("class", "radio-label-label");
      }
    } else if (e.target.value === "MultiSelect") {
      if (element !== null) {
        if (element.controlType != e.target.value) {
          element = null;
        }
      }
      let bodyWrapper = document.getElementById(bodyWrapperId);

      if (element === null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
          if (e.target.className === "select-control validation") {
            e.target.setAttribute("class", "select-control");
          }

          if (bodyWrapper.className === "validation-wrapper") {
            bodyWrapper.setAttribute("class", "body-wrapper");
          }
          let item = builder.find(
              (card) =>
                  card.cardId === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.controlRequireId).disabled = false;
          item.controls = {control: []};
        }
        let multiSelectParentDiv = document.createElement("div");
        multiSelectParentDiv.setAttribute(
            "class",
            "d-flex justify-content-between"
        );

        let multiSelectDiv = document.createElement("div");

        multiSelectDiv.setAttribute("class", "input-group input-group-outline");
        multiSelectDiv.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id + "_div_multi_select"
        );

        multiSelectParentDiv.appendChild(multiSelectDiv);

        bodyWrapper.appendChild(multiSelectParentDiv);

        let selectInputParentDiv = document.createElement("div");
        selectInputParentDiv.setAttribute(
            "class",
            "d-flex justify-content-between my-4"
        );

        let inputMultiSelectDiv = document.createElement("div");
        inputMultiSelectDiv.setAttribute(
            "class",
            "input-group input-group-outline"
        );
        inputMultiSelectDiv.setAttribute(
            "id",
            e.target.parentNode.parentNode.parentNode.id +
            "_div_multi_Input_Select"
        );
        selectInputParentDiv.appendChild(inputMultiSelectDiv);
        bodyWrapper.appendChild(selectInputParentDiv);

        let getInputMultiSelectDiv = document.getElementById(
            e.target.parentNode.parentNode.parentNode.id +
            "_div_multi_Input_Select"
        );
        let inputControl = document.createElement("input");
        inputControl.id =
            getInputMultiSelectDiv.id + "_multi_select_Input_" + 1;
        inputControl.setAttribute("class", "user-input");
        inputControl.setAttribute(
            "placeholder",
            "Please enter options and press Enter..."
        );
        getInputMultiSelectDiv.appendChild(inputControl);

        let getMultiSelectDiv = document.getElementById(
            e.target.parentNode.parentNode.parentNode.id + "_div_multi_select"
        );

        let multiSelectControl = document.createElement("select");
        multiSelectControl.id = getMultiSelectDiv.id + "_select_" + 1;
        multiSelectControl.setAttribute("class", "user-input");
        multiSelectControl.setAttribute(
            "placeholder",
            "Please enter your answere here..."
        );
        multiSelectControl.multiple = true;
        getMultiSelectDiv.appendChild(multiSelectControl);

        inputControl.addEventListener("keypress", (e) => {
          enterItemToDropDownList(e, multiSelectControl);
        });

        let card = builder.find(
            (x) => x.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        card.controlType = "MultiSelect";
        card.hasControls = true;

        let controls = {control: []};

        let control = {};
        control.select_div = multiSelectDiv.id;
        control.select_input_div = inputMultiSelectDiv.id;
        control.select_inputcontrol_div = inputControl.id;
        control.selectControlId = multiSelectControl.id;
        control.selectControlType = multiSelectControl.type;
        control.placeholder = inputControl.placeholder;

        control.options = {option: []};

        controls.control.push(control);

        let index = builder.find(
            (card) =>
                card.cardId === e.target.parentNode.parentNode.parentNode.id
        );
        index.controls = controls;
      } else if (element !== null) {
        if (bodyWrapper != null) {
          bodyWrapper.innerHTML = "";
        }

        let multiSelectParentDiv = document.createElement("div");
        multiSelectParentDiv.setAttribute(
            "class",
            "d-flex justify-content-between"
        );

        let multiSelectDiv = document.createElement("div");

        multiSelectDiv.setAttribute("class", "input-group input-group-outline");
        multiSelectDiv.setAttribute(
            "id",
            element.controls.control[0].select_div
        );

        multiSelectParentDiv.appendChild(multiSelectDiv);

        bodyWrapper.appendChild(multiSelectParentDiv);

        let selectInputParentDiv = document.createElement("div");
        selectInputParentDiv.setAttribute(
            "class",
            "d-flex justify-content-between my-4"
        );

        let inputMultiSelectDiv = document.createElement("div");
        inputMultiSelectDiv.setAttribute(
            "class",
            "input-group input-group-outline"
        );
        inputMultiSelectDiv.setAttribute(
            "id",
            element.controls.control[0].select_input_div
        );
        selectInputParentDiv.appendChild(inputMultiSelectDiv);
        bodyWrapper.appendChild(selectInputParentDiv);

        let getInputMultiSelectDiv = document.getElementById(
            element.controls.control[0].select_input_div
        );
        let inputControl = document.createElement("input");
        inputControl.id = element.controls.control[0].select_inputcontrol_div;
        inputControl.setAttribute("class", "user-input");
        inputControl.setAttribute(
            "placeholder",
            "Please enter options and press Enter..."
        );
        getInputMultiSelectDiv.appendChild(inputControl);

        let getMultiSelectDiv = document.getElementById(
            element.controls.control[0].select_div
        );

        let multiSelectControl = document.createElement("select");
        multiSelectControl.id = element.controls.control[0].selectControlId;
        multiSelectControl.setAttribute("class", "user-input");
        multiSelectControl.setAttribute(
            "placeholder",
            "Please enter your answere here..."
        );
        multiSelectControl.multiple = true;
        getMultiSelectDiv.appendChild(multiSelectControl);

        element.controls.control[0].options.option.forEach((item) => {
          let option = document.createElement("option");
          option.value = item.option_value;
          option.text = item.option_text;
          option.disabled = item.option_disabled;
          option.selected = item.option_selected;
          let dbId;
          if (item.dbId) {
            dbId = item.dbId;
          } else {
            dbId = crypto.randomUUID();
            option.dbId = dbId;
            item.dbId = dbId;
          }
          option.setAttribute("dbId", dbId);

          multiSelectControl.appendChild(option);
        });

        inputControl.addEventListener("keypress", (e) => {
          enterItemToDropDownList(e, multiSelectControl);
        });
      }
    }
  }
};
const onInputTypeChange = (e, control, element) => {
  control.setAttribute("type", e.target.value);
  control.setAttribute("placeholder", "Please enter " + e.target.value);
  let index = builder.find(
      (card) => card.cardId === e.target.parentNode.parentNode.parentNode.id
  );
  index.controls.control.forEach((element) => {
    element.inputControlType = e.target.value;
    element.placeholder = control.placeholder;
  });
};
const enterItemToDropDownList = (e, selectControl) => {
  if (e.key === "Enter") {
    e.preventDefault();
    let option = document.createElement("option");
    let dbId = crypto.randomUUID()
    option.value = e.target.value;
    option.text = e.target.value;
    option.dbId = dbId;
    option.setAttribute("dbId", dbId)

    selectControl.appendChild(option);
    const regex = 'cardDiv_[0-9]+';
    const ids = selectControl.id.match(regex);
    if (ids === undefined || ids.isEmpty) {
      console.log("this should not happen. Exiting")
      return
    }
    const cardId = ids[0]
    e.target.value = "";

    let options = {};
    options.option_text = option.text;
    options.option_value = option.value;
    options.option_disabled = option.disabled;
    options.option_selected = option.selected;
    options.dbId = dbId;
    let item = builder.find(
        (card) => card.cardId === cardId
    );
    if (item) {
      item.controls.control[0].options.option.push(options);
    }
  }
};
const deleteRadioElement = (e, remove) => {
  let filterControls = builder
      .find(
          (card) =>
              card.cardId === e.target.parentNode.parentNode.parentNode.parentNode.id
      )
      .controls.control.filter((x) => x.selectDivId !== e.target.parentNode.id);

  let controls = builder.find(
      (card) =>
          card.cardId === e.target.parentNode.parentNode.parentNode.parentNode.id
  );
  controls.controls.control = filterControls;
  e.target.parentNode.parentNode.remove();
};

const AddNewOption = (
    e,
    controlType,
    current,
    radioDiv,
    index,
    hiddenIndexLabel
) => {
  e.preventDefault();

  if (controlType === "Radio") {
    let radioParentDiv = document.createElement("div");
    radioParentDiv.setAttribute("class", "d-flex justify-content-between py-2");

    let AddRadioDiv = document.createElement("div");
    let currentIndex = updateRadioIndex(e);

    AddRadioDiv.setAttribute("class", "d-flex align-item-center w-100");
    AddRadioDiv.setAttribute(
        "id",
        e.target.parentNode.parentNode.parentNode.parentNode.id +
        "_divRadio_" +
        currentIndex
    );

    radioParentDiv.appendChild(AddRadioDiv);

    let input = document.createElement("input");
    input.type = "Radio";
    input.name = e.target.parentNode.parentNode.parentNode.id;
    input.id = AddRadioDiv.id + "_radio_" + currentIndex;
    let dbId = crypto.randomUUID()
    input.dbId = dbId
    input.setAttribute("dbId", dbId)
    let label = document.createElement("label");
    label.id = AddRadioDiv.id + "Option_" + currentIndex;

    let textYes = document.createTextNode("Option " + currentIndex);

    let removeButton = document.createElement("button");

    removeButton.setAttribute(
        "id",
        e.target.parentNode.parentNode.parentNode.id + "_remove_" + index
    );
    removeButton.innerHTML = "x";
    removeButton.setAttribute("class", "btn-remove");

    label.appendChild(textYes);
    AddRadioDiv.appendChild(input);
    AddRadioDiv.appendChild(label);
    AddRadioDiv.appendChild(removeButton);
    label.setAttribute("class", "radio-label");
    label.addEventListener("click", (e) => {
      editRadioOnClick(e, removeButton);
    });

    removeButton.addEventListener("click", (e) => {
      deleteRadioElement(e, removeButton);
    });

    let controls = {control: []};

    let control = {};
    control.selectDivId =
        e.target.parentNode.parentNode.parentNode.parentNode.id +
        "_divRadio_" +
        currentIndex;
    control.selectControlId = input.id;
    control.selectControlType = input.type;
    control.placeholder = input.placeholder;

    control.text = label.innerHTML;
    control.dbId = dbId

    control.labelId = label.id;
    control.label_type = label.tagName;

    controls.control.push(control);

    let item = builder.find(
        (card) =>
            card.cardId === e.target.parentNode.parentNode.parentNode.parentNode.id
    );
    item.controls.control.push(controls.control[0]);

    label.click();
    hiddenIndexLabel.value = currentIndex;
  } else if (controlType === "Checkbox") {
    let checkboxParentDiv = document.createElement("div");
    checkboxParentDiv.setAttribute(
        "class",
        "d-flex justify-content-between py-2"
    );

    let AddCheckboxDiv = document.createElement("div");
    let currentIndex = updateRadioIndex(e);
    AddCheckboxDiv.setAttribute("class", "d-flex align-item-center w-100");
    AddCheckboxDiv.setAttribute(
        "id",
        e.target.parentNode.parentNode.parentNode.id +
        "_divCheckbox_" +
        currentIndex
    );

    checkboxParentDiv.appendChild(AddCheckboxDiv);

    let dbId = crypto.randomUUID()
    let input = document.createElement("input");
    input.type = "checkbox";
    input.name = e.target.parentNode.parentNode.parentNode.id;
    input.id = AddCheckboxDiv.id + "_checkbox_" + currentIndex;
    input.dbId = dbId
    input.setAttribute("dbId", dbId)
    let label = document.createElement("label");
    label.id = AddCheckboxDiv.id + "_checkboxOption_" + currentIndex;

    let textYes = document.createTextNode("Option " + currentIndex);

    let removeButton = document.createElement("button");

    removeButton.setAttribute(
        "id",
        e.target.parentNode.parentNode.parentNode.id + "_remove_" + index
    );
    removeButton.innerHTML = "x";
    removeButton.setAttribute("class", "btn-remove");

    label.appendChild(textYes);
    AddCheckboxDiv.appendChild(input);
    AddCheckboxDiv.appendChild(label);
    AddCheckboxDiv.appendChild(removeButton);
    label.setAttribute("class", "radio-label");
    label.addEventListener("click", (e) => {
      editRadioOnClick(e, removeButton);
    });
    removeButton.addEventListener("click", (e) => {
      deleteRadioElement(e, removeButton);
    });
    let controls = {control: []};

    let control = {};
    control.selectDivId =
        e.target.parentNode.parentNode.parentNode.id +
        "_divCheckbox_" +
        currentIndex;
    control.selectControlId = input.id;
    control.selectControlType = input.type;
    control.placeholder = input.placeholder;

    control.text = label.innerHTML;

    control.labelId = label.id;
    control.label_type = label.tagName;
    control.dbId = dbId

    controls.control.push(control);

    let item = builder.find(
        (card) =>
            card.cardId === e.target.parentNode.parentNode.parentNode.parentNode.id
    );
    item.controls.control.push(controls.control[0]);

    label.click();
    hiddenIndexLabel.value = currentIndex;
  }
};

const updateRadioIndex = (e) => {
  let item = builder.find(
      (card) =>
          card.cardId === e.target.parentNode.parentNode.parentNode.parentNode.id
  );

  let currentIndex = parseInt(item.hiddenIndex) + 1;
  item.hiddenIndex = currentIndex;
  return (parseInt(currentIndex));
};

const changeInputToLabel = (e, remove, prevValue) => {
  let parent = document.getElementById(e.target.parentNode.id);
  if (e.target.tagName === "INPUT" && e.target.value === "") {
    e.target.value = prevValue;
  }
  if (e.target.tagName === "INPUT" && e.target.value !== "") {
    let replaceInputToLabel = document.getElementById(e.target.id);

    let label = document.createElement("label");
    let index = parent.children.length + 1;
    label.id = parent.id + "Option_" + index;
    var newOption = document.createTextNode(e.target.value);

    let control = builder
        .find(
            (card) =>
                card.cardId ===
                e.target.parentNode.parentNode.parentNode.parentNode.id
        )
        .controls.control.find((x) => x.selectDivId === e.target.parentNode.id);

    control.text = e.target.value;

    label.appendChild(newOption);
    label.setAttribute("class", "radio-label");
    label.addEventListener("click", (e) => {
      editOnLabelClick(e, remove);
    });
    parent.replaceChild(label, replaceInputToLabel);
  }
};

const editOnLabelClick = (e, remove) => {
  let parent = document.getElementById(e.target.parentNode.id);
  if (e.target.tagName === "LABEL" && e.target.value !== "") {
    let label = document.getElementById(e.target.id);

    let input = document.createElement("input");
    input.id = label.id;
    input.value = label.innerText;
    input.setAttribute("class", "radio-input");
    parent.replaceChild(input, label);
    input.focus();
    let prevValue = input.value;
    input.addEventListener("focusout", (e) => {
      changeInputToLabel(e, remove, prevValue);
    });
  }
};

const editRadioOnClick = (e, remove) => {
  let parent = document.getElementById(e.target.parentNode.id);
  if (e.target.tagName === "LABEL" && e.target.value !== "") {
    let label = document.getElementById(e.target.id);

    let input = document.createElement("input");
    input.id = label.id;
    input.value = label.innerText;
    input.setAttribute("class", "radio-input");
    parent.replaceChild(input, label);
    input.focus();
    let prevValue = input.value;
    input.addEventListener("focusout", (e) => {
      changeInputToLabel(e, remove, prevValue);
    });
  }
};

const PrintFormBuilder = (jsonData, responsesString, pathwaysString) => {
  const responses = JSON.parse(responsesString)
  const pathways = JSON.parse(pathwaysString)

  if (jsonData != null) {
    let loadedData = JSON.parse(jsonData)
    if (loadedData.questions) {
      builder = loadedData.questions
    }
    let mainDiv = document.getElementById("div_drager");
    mainDiv.innerHTML = "";
    builder.forEach((element) => {
      if (element.dbId === undefined) {
        element.dbId = crypto.randomUUID();
      }
      createCardFromJSON(mainDiv, element);
      questions++
    });
  }

  builder.forEach((element) => {
    let card = document.getElementById(element.cardId);
    let question = document.getElementById(element.questionId);

    if (question.value === "") {
      question.setAttribute("class", "question-input validation");
      alert('Must specify an input value');
      return
    } else {
      question.setAttribute("class", "question-input");
      element.question = question.value;
    }

    if (element.hasControls === undefined && (element.controlType !== "Pathways") && element.controlType !== "Signature") {
      card.setAttribute("class", "card p-3 my-3 box-shadow-validation");
      alert('Must specify controls');
    } else if (element.hasControls !== undefined) {
      card.setAttribute("class", "card p-3 my-3");
    }
  });

  let mainDiv = document.getElementById("div_drager");
  mainDiv.innerHTML = "";
  let index = 0;
  builder.forEach((element) => {
    let questionInput;
    let response = responses.find(resp => element.dbId === resp.questionId);

    if (element.question !== undefined && (element.hasControls === true || (element.controlType === "Pathways" || element.controlType === "Signature"))) {
      if (element.controlType === "Input") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.cardId);
        inputCard.setAttribute("dbId", element.dbId);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.questionId);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperIdId);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let input = document.createElement("input");
        input.setAttribute("class", "user-input-label");
        input.id = element.controls.control[0].inputControlId;
        input.placeholder = element.controls.control[0].placeholder;
        input.type = element.controls.control[0].inputControlType;
        input.disabled = true;
        if (response) {
          input.value = response.response;
        }

        input.required = element.isRequired;
        inputParentDiv.appendChild(input);
        bodyWrapper.appendChild(inputParentDiv);
      } else if (element.controlType === "MultilineText") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.cardId);
        inputCard.setAttribute("dbId", element.dbId);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.questionId);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperIdId);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let input = document.createElement("textarea");
        input.setAttribute("class", "user-textarea-label");
        input.id = element.controls.control[0].inputControlId;
        input.placeholder = element.controls.control[0].placeholder;
        input.disabled = true;
        input.innerText = response.response;

        input.required = element.isRequired;
        inputParentDiv.appendChild(input);
        bodyWrapper.appendChild(inputParentDiv);
      } else if (element.controlType === "Date") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.cardId);
        inputCard.setAttribute("dbId", element.dbId);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.questionId);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperIdId);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let input = document.createElement("input");
        input.setAttribute("class", "user-input-label date_items");
        input.id = element.controls.control[0].inputControlId;
        input.placeholder = element.controls.control[0].placeholder;
        input.type = element.controls.control[0].inputControlType;
        input.disabled = true;
        if (response) {
          input.value = response.response;
        }


        input.required = element.isRequired;
        inputParentDiv.appendChild(input);
        bodyWrapper.appendChild(inputParentDiv);
      } else if (element.controlType === "IUnderstand") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.cardId);
        inputCard.setAttribute("dbId", element.dbId);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.questionId);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperIdId);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let groupDiv = document.createElement("div");
        groupDiv.setAttribute("class", "d-flex justify-content-between py-2");

        let controldiv = document.createElement("div");
        controldiv.setAttribute("class", "d-flex align-item-center w-100");
        controldiv.id = element.controls.control[0].inputDivId;

        let input = document.createElement("input");
        input.id = element.controls.control[0].inputControlId;
        input.placeholder = element.controls.control[0].placeholder;
        input.type = element.controls.control[0].inputControlType;
        input.disabled = true;
        input.checked = JSON.parse(response.response.toLowerCase());
        let dbId;
        if (element.controls.control[0].dbId) {
          dbId = element.controls.control[0].dbId
        } else {
          dbId = crypto.randomUUID()
          element.controls.control[0].dbId = dbId
        }
        input.setAttribute("dbId", dbId);
        input.required = element.isRequired;

        let label = document.createElement("label");
        label.id = element.controls.control[0].labelId;

        let textYes = document.createTextNode(element.controls.control[0].text);

        label.appendChild(textYes);
        controldiv.appendChild(input);
        controldiv.appendChild(label);
        label.setAttribute("class", "radio-label-label");
        groupDiv.appendChild(controldiv);
        bodyWrapper.appendChild(groupDiv);
      } else if (element.controlType === "Pathways") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.cardId);
        inputCard.setAttribute("dbId", element.dbId);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.questionId);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperIdId);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let selectControl = document.createElement("select");
        selectControl.setAttribute("class", "user-input-label");
        selectControl.disabled = true;

        selectControl.required = element.isRequired;

        inputParentDiv.appendChild(selectControl);
        bodyWrapper.appendChild(inputParentDiv);

        pathways.forEach((item) => {
          let control_option = document.createElement("option");
          control_option.text = item.value;
          control_option.value = item.value;
          control_option.disabled = false;
          control_option.selected = response ? response.response === item.id : false;

          selectControl.appendChild(control_option);
        });
      } else if (
          element.controlType === "SingleSelect" ||
          element.controlType === "MultiSelect"
      ) {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.cardId);
        inputCard.setAttribute("dbId", element.dbId);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.questionId);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperIdId);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let selectControl = document.createElement("select");
        selectControl.setAttribute("class", "user-input-label");
        selectControl.id = element.controls.control[0].selectControlId;
        selectControl.placeholder = element.controls.control[0].placeholder;
        selectControl.disabled = true;
        selectControl.required = element.isRequired;

        if (element.controlType === "MultiSelect") {
          selectControl.multiple = true;
        }

        inputParentDiv.appendChild(selectControl);
        bodyWrapper.appendChild(inputParentDiv);

        let control = document.getElementById(selectControl.id);
        let userResponses = response.response.split(',')
        element.controls.control[0].options.option.forEach((item) => {
          let control_option = document.createElement("option");
          control_option.text = item.option_text;
          control_option.value = item.option_value;
          let dbId;
          if (item.dbId) {
            dbId = item.dbId;
          } else {
            dbId = crypto.randomUUID();
            control_option.dbId = dbId;
            item.dbId = dbId;
          }
          control_option.setAttribute("dbId", dbId);
          control_option.disabled = item.option_disabled;
          control_option.selected = userResponses.includes(item.dbId);

          control.appendChild(control_option);
        });
      } else if (element.controlType === "YesNo") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.cardId);
        inputCard.setAttribute("dbId", element.dbId);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.questionId);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperIdId);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);
        element.controls.control.forEach((option) => {
          let groupDiv = document.createElement("div");
          groupDiv.setAttribute("class", "d-flex justify-content-between py-2");

          let controldiv = document.createElement("div");
          controldiv.setAttribute("class", "d-flex align-item-center w-100");
          controldiv.id = option.selectDivId;

          let input = document.createElement("input");
          input.id = option.selectControlId;
          input.placeholder = option.placeholder;
          input.type = option.selectControlType;
          input.name = bodyWrapper.id;
          let dbId;
          if (option.dbId) {
            dbId = option.dbId;
          } else {
            dbId = crypto.randomUUID();
            input.dbId = dbId
            option.dbId = dbId;
          }
          input.setAttribute("dbId", dbId)
          input.checked = dbId === response.response
          input.disabled = true

          input.required = option.isRequired;
          let label = document.createElement("label");
          let textYes = document.createTextNode(option.text);

          label.appendChild(textYes);
          controldiv.appendChild(input);
          controldiv.appendChild(label);
          label.setAttribute("class", "radio-label-label");
          groupDiv.appendChild(controldiv);
          bodyWrapper.appendChild(groupDiv);
        });
      } else if (
          element.controlType === "Radio" ||
          element.controlType === "Checkbox"
      ) {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.cardId);
        inputCard.setAttribute("dbId", element.dbId);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.questionId);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperIdId);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        element.controls.control.forEach((option) => {
          let groupDiv = document.createElement("div");
          groupDiv.setAttribute("class", "d-flex justify-content-between py-2");

          let controldiv = document.createElement("div");
          controldiv.setAttribute("class", "d-flex align-item-center w-100");
          controldiv.id = option.selectDivId;

          let input = document.createElement("input");
          input.id = option.selectControlId;
          input.placeholder = option.placeholder;
          input.type = option.selectControlType;
          input.name = bodyWrapper.id;
          let dbId;
          if (option.dbId) {
            dbId = option.dbId;
          } else {
            dbId = crypto.randomUUID();
            input.dbId = dbId;
            option.dbId = dbId
          }
          input.setAttribute("dbId", dbId);
          input.checked = option.dbId === response.response
          input.disabled = true

          if (element.controlType === "Radio") {
            input.required = option.isRequired;
          }

          let label = document.createElement("label");
          label.id = option.labelId;
          let textYes = document.createTextNode(option.text);

          label.appendChild(textYes);
          controldiv.appendChild(input);
          controldiv.appendChild(label);
          label.setAttribute("class", "radio-label-label");
          groupDiv.appendChild(controldiv);
          bodyWrapper.appendChild(groupDiv);
        });
      } else if (element.controlType === "Signature") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.cardId);
        inputCard.setAttribute("dbId", element.dbId);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.questionId);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperIdId);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let img = document.createElement("img")
        img.src = `data:image/png;base64,${response.response}`
        inputParentDiv.appendChild(img)
        bodyWrapper.appendChild(inputParentDiv);
      }
    }
    index++;
  });
  validateCheckboxes({currentTarget: form_builder});
  form_builder.addEventListener("change", validateCheckboxes);
};
const validateCheckboxes = (e) => {
  let wrappers = Array.from(
      e.currentTarget.querySelectorAll(":scope .body-wrapper")
  );
  builder.forEach((element) => {
    let control = builder
        .find((card) => card.cardId === element.cardId)
        .controls.control.find((x) => x.selectControlType === "checkbox");
    if (control !== undefined) {
      if (control.isRequired !== true) {
        let index = wrappers.indexOf(
            wrappers.find((x) => x.id === element.bodyWrapperIdId)
        );
        if (index > -1) {
          wrappers.splice(index, 1);
        }
      }
    } else if (control === undefined) {
      let index = wrappers.indexOf(
          wrappers.find((x) => x.id === element.bodyWrapperIdId)
      );
      if (index > -1) {
        wrappers.splice(index, 1);
      }
    }
  });
  form_submit.disabled = wrappers.reduce(
      (aggr, bodyWrapper) =>
          aggr ||
          bodyWrapper.querySelectorAll(":scope input[type=checkbox]:checked")
              .length < 1,
      false
  );
};
const SaveFormBuilder = () => {
  let is_completed = true;


  if (builder.length === 0) {
    alert("Please create form");
    return
  }
  builder.forEach((element) => {
    is_completed = true;
    let question = document.getElementById(element.questionId);
    if (!question) {
      return
    }
    let bodyWrapper = document.getElementById(element.bodyWrapperIdId);

    if (question.value !== "") {
      element.question = question.value;
    } else if (question.value === "" && (element.controlType !== "Pathways" && element.controlType !== "Signature")) {
      is_completed = false;
      question.setAttribute("class", "question-input validation");
      alert("Value cannot be empty");
      return;
    }

    let select_type = document.getElementById(element.selectTagId);
    if (select_type.value === "Select" || select_type.selectedIndex === 0) {
      is_completed = false;
      select_type.setAttribute("class", "select-control validation");
      alert("Must select a question type");
      return;
    } else if (
        select_type.value !== "Select" ||
        select_type.selectedIndex !== 0
    ) {
      select_type.setAttribute("class", "select-control");
    }
    if (element.hasControls === undefined && (element.controlType !== "Pathways" && element.controlType !== "Signature")) {
      if (bodyWrapper.innerHTML === "") {
        is_completed = false;
        bodyWrapper.setAttribute("class", "validation-wrapper");
        alert("Value without controls cannot be empty");
        return;
      }
    } else if (element.hasControls !== undefined) {
      if (element.controls.control.length === 0) {
        bodyWrapper.setAttribute("class", "validation-wrapper");
        is_completed = false;
        alert("Value with controls cannot be empty");
        return;
      } else if (element.controls.control.length > 0) {
        bodyWrapper.setAttribute("class", "body-wrapper");
      }
    }

    if (
        element.controlType === "MultiSelect" ||
        element.controlType === "SingleSelect"
    ) {
      if (element.controls.control[0].options.option.length === 0) {
        bodyWrapper.setAttribute("class", "validation-wrapper");
        is_completed = false;
        alert("Value for control cannot be empty");

      } else if (element.controls.control[0].options.option.length > 0) {
        bodyWrapper.setAttribute("class", "body-wrapper");
      }
    }
  });

  //convert data to json
  if (is_completed) {
    jsonData = JSON.stringify({
      questions: builder,
    });
    //post data to database using API and pass builder as parameter
    let url = `/application`
    fetch(url, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: jsonData
    })
        .then((response) => response.json())
        .then(async data => {
          if (data.error) {
            await new BsDialogs().ok('Uh Oh', 'We had an error saving your application\n' + data.error);
          } else {
            await new BsDialogs().ok('Success', 'We successfully saved your application');
            window.location.reload();
          }
        })
        .catch(async error => {
          await new BsDialogs().ok('Uh Oh!', 'We had an error saving your application\n' + error);
        });
  }
};

const LoadFormBuilder = (jsonData) => {
  builder = [];

  //Call API here to load data from database

  if (jsonData != null) {
    let loadedData = JSON.parse(jsonData)
    if (loadedData.questions) {
      builder = loadedData.questions
    }
    let mainDiv = document.getElementById("div_drager");
    mainDiv.innerHTML = "";
    builder.forEach((element) => {
      if (element.dbId === undefined) {
        element.dbId = crypto.randomUUID();
      }
      createCardFromJSON(mainDiv, element);
      questions++
    });
  }
};

const createCardFromJSON = (mainDiv, elements) => {
  var element = document.createElement("div");
  var innerDiv = document.createElement("div");
  var inputGroup = document.createElement("div");
  var inputCheckBox = document.createElement("input");
  var selectGroup = document.createElement("div");
  var questionInput = document.createElement("input");
  var selectTag = document.createElement("select");
  var bodyWrapper = document.createElement("div");
  var footerWrapper = document.createElement("div");
  var actionWrapper = document.createElement("div");
  var requiredWrapper = document.createElement("div");
  var footerLabel = document.createElement("label");
  var formCheck = document.createElement("div");
  var imgDeleteWrapper = document.createElement("div");
  var imgDelete = document.createElement("i");

  element.setAttribute("id", elements.cardId);
  if (element.dbId === undefined) {
    element.setAttribute("dbId", crypto.randomUUID())
  } else {
    element.setAttribute("dbId", elements.dbId)
  }

  let input = document.createElement("input");
  input.setAttribute("id", elements.inputId);
  input.setAttribute("style", "font-weight: bolder;");

  selectTag.id = elements.selectTagId;

  bodyWrapper.id = elements.bodyWrapperIdId;

  element.setAttribute("class", "card p-3 my-3");
  innerDiv.setAttribute("class", "d-flex justify-content-between");
  inputGroup.setAttribute("class", "input-group input-group-outline");
  selectGroup.setAttribute("class", "select-group");
  questionInput.setAttribute("class", "question-input");
  questionInput.setAttribute("placeholder", "Question");
  questionInput.setAttribute("id", elements.questionId);

  questionInput.value = elements.question;

  selectTag.setAttribute("class", "select-control");
  bodyWrapper.setAttribute("class", "body-wrapper");
  actionWrapper.setAttribute("class", "action-wrapper");
  imgDelete.innerText = "delete"
  imgDeleteWrapper.setAttribute("class", "text-center me-2 d-flex align-items-center justify-content-center");
  imgDeleteWrapper.appendChild(imgDelete);
  imgDelete.setAttribute("class", "material-icons opacity-50");
  footerLabel.setAttribute("class", "footer-label");
  formCheck.setAttribute("class", "form-check form-switch ps-0");

  requiredWrapper.setAttribute(
      "class",
      "d-flex align-items-center required-wrapper"
  );
  footerWrapper.setAttribute(
      "class",
      "footer-wrapper d-flex justify-content-end align-items-center"
  );
  inputCheckBox.setAttribute("class", "form-check-input ms-auto");
  inputCheckBox.setAttribute("type", "checkbox");
  inputCheckBox.id = elements.controlRequireId;
  inputCheckBox.checked = elements.isRequired;

  footerLabel.innerHTML = "Required";
  mainDiv.appendChild(element);
  element.appendChild(innerDiv);
  innerDiv.appendChild(inputGroup);
  inputGroup.appendChild(questionInput);
  innerDiv.appendChild(selectGroup);
  selectGroup.appendChild(selectTag);
  element.appendChild(bodyWrapper);
  element.appendChild(footerWrapper);
  footerWrapper.appendChild(actionWrapper);
  actionWrapper.appendChild(imgDeleteWrapper);
  footerWrapper.appendChild(requiredWrapper);
  requiredWrapper.appendChild(footerLabel);
  requiredWrapper.appendChild(formCheck);
  formCheck.appendChild(inputCheckBox);

  imgDelete.addEventListener("click", (e) => {
    deleteCard(e, element);
  });

  inputCheckBox.addEventListener("change", (e) => {
    object.isRequired = e.target.checked;
    RequiredChanged(e, bodyWrapper);
  });

  for (var i = 0; i < listControls.length; i++) {
    var option = document.createElement("option");
    option.value = listControls[i];
    option.text = listControls[i];
    if (option.value === elements.controlType) {
      option.selected = true;
    }
    selectTag.appendChild(option);
  }
  document.getElementById("div_drager").appendChild(element, false);

  input.focus();
  input.addEventListener("focusout", ElementHeaderInput, false);

  selectTag.addEventListener(
      "change",
      (e) => {
        selectItemChanged(e, elements.bodyWrapperIdId, elements);
      },
      false
  );
  selectTag.dispatchEvent(new Event("change"));
};
