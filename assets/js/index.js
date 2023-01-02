var cards = 0;
var control = 0;
var listControls = [
  "Select",
  "Input",
  "Multiline Text",
  "Radio",
  "Checkbox",
  "Date",
  "Yes/No",
  "I Understand",
  "Single Select",
  "Multi Select",
];
var inputTypesList = ["text", "name", "email", "phone", "number", "decimal"];
var listOptions = ["Option 1", "Option 2", "Option 3"];
var listOptionsYesNo = ["Yes", "No"];
var current_card = null;

var builder = [];
var form_details = [];
var jsonData = "";

const form_builder = document.getElementById("form_builder");
const form_submit = document.getElementById("form_submit");

const addDivElement = () => {
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
  var imgDelete = document.createElement("img");

  let cardId = (cards = cards + 1);
  let card = "cardDiv_" + cardId;
  element.setAttribute("id", card);

  var input = document.createElement("input");
  let controlId = (control = control + 1);
  let inputId = "inputControl_" + controlId;
  input.value = "Please enter question";
  input.setAttribute("id", inputId);
  input.setAttribute("style", "font-weight: bolder;");

  var select = document.createElement("select");
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
  imgDelete.setAttribute("src", "/assets/img/delete-icon.png");
  imgDelete.setAttribute("width", "20");
  footerLabel.setAttribute("class", "footer-label");
  formCheck.setAttribute("class", "form-check form-switch ps-0");

  requiredWrapper.setAttribute(
    "class",
    "d-flex align-items-center required-wrapper"
  );
  footerWrapper.setAttribute(
    "class",
    "footer-wrapper d-flex justify-content-end align-items-centerce"
  );
  inputCheckBox.setAttribute("class", "form-check-input ms-auto");
  inputCheckBox.setAttribute("type", "checkbox");

  let formCheckId = card + "_requiredId_" + controlId;
  inputCheckBox.id = formCheckId;
  inputCheckBox.disabled = true;

  let object = new Object();
  object.card_id = card;
  object.inputId = inputId;
  object.question_id = questionInput.id;
  object.question_placeholder = questionInput.placeholder;
  object.selectTag_id = selectTag.id;
  object.control_require_id = inputCheckBox.id;
  object.bodyWrapperId_id = bodyWrapperId;
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
  actionWrapper.appendChild(imgDelete);
  footerWrapper.appendChild(requiredWrapper);
  requiredWrapper.appendChild(footerLabel);
  requiredWrapper.appendChild(formCheck);
  formCheck.appendChild(inputCheckBox);

  imgDelete.addEventListener("click", (e) => {
    deleteCard(e, element);
  });

  inputCheckBox.addEventListener("change", (e) => {
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
  var shouldDelete = confirm("Do you really want to delete the selected card?");
  if (shouldDelete) {
    control.remove();
    let item = builder.find(
      (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
    );
    let index = builder.indexOf(item);
    if (index > -1) {
      builder.splice(index, 1);
    }
  }
};

const RequiredChanged = (e, control) => {
  if (e.target.checked) {
    let option = control.parentNode.getElementsByTagName("select")[0];

    if (option.value === "Single Select" || option.value === "Multi Select") {
      let select = control.getElementsByTagName("select");
      if (select != null) {
        select[0].required = true;
        let index = builder.find(
          (card) =>
            card.card_id ===
            e.target.parentNode.parentNode.parentNode.parentNode.id
        );
        index.controls.control.forEach((element) => {
          element.is_requried = true;
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
                card.card_id ===
                e.target.parentNode.parentNode.parentNode.parentNode.id
            );
            index.controls.control.forEach((element) => {
              element.is_requried = true;
            });
          } else if (item.type === "checkbox") {
            let parent = document.getElementById(item.name);
            parent.setAttribute("required", "required");
            let index = builder.find(
              (card) =>
                card.card_id ===
                e.target.parentNode.parentNode.parentNode.parentNode.id
            );
            index.controls.control.forEach((element) => {
              element.is_requried = true;
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
              card.card_id ===
              e.target.parentNode.parentNode.parentNode.parentNode.id
          );
          index.controls.control.forEach((element) => {
            element.is_requried = true;
          });
        }
      }
    }
  } else if (!e.target.checked) {
    let option = control.parentNode.getElementsByTagName("select")[0];

    if (option.value === "Single Select" || option.value === "Multi Select") {
      let select = control.getElementsByTagName("select");
      if (select != null) {
        select[0].required = false;
        let index = builder.find(
          (card) =>
            card.card_id ===
            e.target.parentNode.parentNode.parentNode.parentNode.id
        );
        index.controls.control.forEach((element) => {
          element.is_requried = false;
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
                card.card_id ===
                e.target.parentNode.parentNode.parentNode.parentNode.id
            );
            index.controls.control.forEach((element) => {
              element.is_requried = false;
            });
          } else if (item.type === "checkbox") {
            let parent = document.getElementById(item.name);
            parent.setAttribute("required", "required");
            let index = builder.find(
              (card) =>
                card.card_id ===
                e.target.parentNode.parentNode.parentNode.parentNode.id
            );
            index.controls.control.forEach((element) => {
              element.is_requried = false;
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
              card.card_id ===
              e.target.parentNode.parentNode.parentNode.parentNode.id
          );
          index.controls.control.forEach((element) => {
            element.is_requried = false;
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
  label.addEventListener("click", editOnLableClick);
  parent.replaceChild(label, replaceInputToLabel);
};

const selectItemChanged = (e, bodyWrapperId, element) => {
  if (e.target.value !== "select") {
    if (e.target.value === "Input") {
      if (element !== null) {
        if (element.control_type != e.target.value) {
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
              card.card_id === e.target.parentNode.parentNode.parentNode.id
          );
          item.controls = { control: [] };
          document.getElementById(item.control_require_id).disabled = false;
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
          "Please enter your answere here..."
        );
        inputControl.setAttribute("class", "user-input");

        getInputDiv.appendChild(inputControl);

        let inputTypes = document.createElement("select");

        inputTypes.id = inputControl.id + "_Input_Types_" + 1;

        for (var i = 0; i < inputTypesList.length; i++) {
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
          (x) => x.card_id === e.target.parentNode.parentNode.parentNode.id
        );
        card.control_type = "Input";
        card.hasControls = true;

        let controls = { control: [] };
        let control = new Object();
        control.input_div_id =
          e.target.parentNode.parentNode.parentNode.id + "_divInput";
        control.inputControl_id = inputControl.id;
        control.inputControl_type = inputControl.type;
        control.placeholder = inputControl.placeholder;
        control.input_select_id = inputTypes.id;

        controls.control.push(control);

        let index = builder.find(
          (card) =>
            card.card_id === e.target.parentNode.parentNode.parentNode.id
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

        inputDiv.setAttribute("id", element.controls.control[0].input_div_id);

        inputParentDiv.appendChild(inputDiv);

        bodyWrapper.appendChild(inputParentDiv);

        let getInputDiv = document.getElementById(
          element.controls.control[0].input_div_id
        );
        let inputControl = document.createElement("input");
        inputControl.id = element.controls.control[0].inputControl_id;
        inputControl.type = element.controls.control[0].inputControl_type;

        inputControl.setAttribute(
          "placeholder",
          element.controls.control[0].placeholder
        );
        inputControl.setAttribute("class", "user-input");

        getInputDiv.appendChild(inputControl);

        let inputTypes = document.createElement("select");

        inputTypes.id = element.controls.control[0].input_select_id;

        for (var i = 0; i < inputTypesList.length; i++) {
          let option = document.createElement("option");
          option.value = inputTypesList[i];
          option.text = inputTypesList[i];
          if (element.controls.control[0].inputControl_type === option.value) {
            option.selected = true;
          }
          inputTypes.appendChild(option);
        }

        inputParentDiv.appendChild(inputTypes);

        inputTypes.addEventListener("change", (e) => {
          onInputTypeChange(e, inputControl);
        });
      }
    } else if (e.target.value === "Multiline Text") {
      if (element !== null) {
        if (element.control_type != e.target.value) {
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
              card.card_id === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.control_require_id).disabled = false;
          if (item.controls !== undefined) {
            item.controls = { control: [] };
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
          (x) => x.card_id === e.target.parentNode.parentNode.parentNode.id
        );
        card.control_type = "Multiline Text";
        card.hasControls = true;

        let controls = { control: [] };
        let control = new Object();
        control.input_div_id =
          e.target.parentNode.parentNode.parentNode.id + "_divMultilineInput";
        control.inputControl_id = textAreaControl.id;
        control.inputControl_type = textAreaControl.type;
        control.placeholder = textAreaControl.placeholder;
        controls.control.push(control);

        let index = builder.find(
          (card) =>
            card.card_id === e.target.parentNode.parentNode.parentNode.id
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
          element.controls.control[0].input_div_id
        );

        inputParentDiv.appendChild(textAreaDiv);

        bodyWrapper.appendChild(inputParentDiv);

        let getMultiLineInputDiv = document.getElementById(
          element.controls.control[0].input_div_id
        );
        let textAreaControl = document.createElement("textarea");
        textAreaControl.id = element.controls.control[0].inputControl_id;
        textAreaControl.setAttribute("class", "user-textarea");
        textAreaControl.setAttribute(
          "placeholder",
          element.controls.control[0].placeholder
        );
        getMultiLineInputDiv.appendChild(textAreaControl);
      }
    } else if (e.target.value === "Radio") {
      if (element !== null) {
        if (element.control_type != e.target.value) {
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
              card.card_id === e.target.parentNode.parentNode.parentNode.id
          );
          item.controls = { control: [] };
          document.getElementById(item.control_require_id).disabled = false;
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

          radioParentDiv.appendChild(radioDiv);

          bodyWrapper.appendChild(radioParentDiv);

          let getDiv = document.getElementById(
            e.target.parentNode.parentNode.parentNode.id + "_divRadio_" + index
          );
          let input = document.createElement("input");
          input.type = "Radio";
          input.name = bodyWrapper.id;
          input.id = getDiv.id + "_radio_" + index;
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
              (x) => x.card_id === e.target.parentNode.parentNode.parentNode.id
            );
            card.control_type = "Radio";
            card.hasControls = true;
            card.hiddenIndex = hiddenIndexLabel.value;
            let controls = { control: [] };

            let control = new Object();
            control.select_div_id =
              e.target.parentNode.parentNode.parentNode.id +
              "_divRadio_" +
              index;
            control.select_control_id = input.id;
            control.select_control_type = input.type;
            control.placeholder = input.placeholder;
            control.lastIndex = hiddenIndexLabel.value;

            control.text = label.innerHTML;

            control.label_id = label.id;
            control.label_type = label.tagName;

            controls.control.push(control);

            let item = builder.find(
              (card) =>
                card.card_id === e.target.parentNode.parentNode.parentNode.id
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
              element.controls.control[index].select_div_id
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
              element.controls.control[index].select_div_id
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
            input.id = element.controls.control[index].select_control_id;
            let label = document.createElement("label");
            label.id = element.controls.control[index].label_id;

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
        if (element.control_type != e.target.value) {
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
              card.card_id === e.target.parentNode.parentNode.parentNode.id
          );
          item.controls = { control: [] };
          document.getElementById(item.control_require_id).disabled = false;
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
              (x) => x.card_id === e.target.parentNode.parentNode.parentNode.id
            );
            card.control_type = "Checkbox";
            card.hasControls = true;
            card.hiddenIndex = hiddenIndexLabel.value;

            let controls = { control: [] };

            let control = new Object();
            control.select_div_id =
              e.target.parentNode.parentNode.parentNode.id +
              "_divCheckbox_" +
              index;
            control.select_control_id = input.id;
            control.select_control_type = input.type;
            control.placeholder = input.placeholder;

            control.text = label.innerHTML;

            control.label_id = label.id;
            control.label_type = label.tagName;

            controls.control.push(control);

            let item = builder.find(
              (card) =>
                card.card_id === e.target.parentNode.parentNode.parentNode.id
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
              element.controls.control[index].select_div_id
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
              element.controls.control[index].select_div_id
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
            input.id = element.controls.control[index].select_control_id;
            let label = document.createElement("label");
            label.id = element.controls.control[index].label_id;

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
    } else if (e.target.value === "Single Select") {
      if (element !== null) {
        if (element.control_type != e.target.value) {
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
              card.card_id === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.control_require_id).disabled = false;
          item.controls = { control: [] };
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

        // let option = document.createElement("option");
        // option.value = "Choose one option";
        // option.text = "Choose one option";
        // option.disabled = true;
        // option.selected = true;
        // selectControl.appendChild(option);

        inputControl.addEventListener("keypress", (e) => {
          enterItemToDropDownList(e, selectControl);
        });

        let card = builder.find(
          (x) => x.card_id === e.target.parentNode.parentNode.parentNode.id
        );
        card.control_type = "Single Select";
        card.hasControls = true;

        let controls = { control: [] };

        let control = new Object();
        control.select_div = selectDiv.id;
        control.select_input_div = inputDiv.id;
        control.select_inputcontrol_div = inputControl.id;
        control.select_control_id = selectControl.id;
        control.select_control_type = selectControl.type;
        control.placeholder = inputControl.placeholder;

        // let options = new Object();
        // options.option_text = option.text;
        // options.option_value = option.value;
        // options.option_disabled = option.disabled;
        // options.option_selected = option.selected;

        control.options = { option: [] };

        // control.options.option.push(options);
        controls.control.push(control);

        let index = builder.find(
          (card) =>
            card.card_id === e.target.parentNode.parentNode.parentNode.id
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
        selectControl.id = element.controls.control[0].select_control_id;
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

          selectControl.appendChild(option);
        });

        inputControl.addEventListener("keypress", (e) => {
          enterItemToDropDownList(e, selectControl);
        });
      }
    } else if (e.target.value === "Date") {
      if (element !== null) {
        if (element.control_type != e.target.value) {
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
              card.card_id === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.control_require_id).disabled = false;
          item.controls = { control: [] };
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
          (x) => x.card_id === e.target.parentNode.parentNode.parentNode.id
        );
        card.control_type = "Date";
        card.hasControls = true;

        let controls = { control: [] };
        let control = new Object();
        control.input_div_id =
          e.target.parentNode.parentNode.parentNode.id + "_divDateTime";
        control.inputControl_id = inputDateControl.id;
        control.inputControl_type = inputDateControl.type;
        control.placeholder = inputDateControl.placeholder;
        controls.control.push(control);

        let index = builder.find(
          (card) =>
            card.card_id === e.target.parentNode.parentNode.parentNode.id
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
        dateDiv.setAttribute("id", element.controls.control[0].input_div_id);

        dateParentDiv.appendChild(dateDiv);

        bodyWrapper.appendChild(dateParentDiv);

        let getDateDiv = document.getElementById(
          element.controls.control[0].input_div_id
        );
        let inputDateControl = document.createElement("input");
        inputDateControl.id = element.controls.control[0].inputControl_id;
        inputDateControl.type = element.controls.control[0].inputControl_type;
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
    } else if (e.target.value === "Yes/No") {
      if (element !== null) {
        if (element.control_type != e.target.value) {
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
              card.card_id === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.control_require_id).disabled = false;
          item.controls = { control: [] };
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

          let textYes = document.createTextNode(listOptionsYesNo[index]);

          label.appendChild(textYes);
          getRadioYesNoDiv.appendChild(input);
          getRadioYesNoDiv.appendChild(label);
          label.setAttribute("class", "radio-label-YesNo");

          let card = builder.find(
            (x) => x.card_id === e.target.parentNode.parentNode.parentNode.id
          );
          card.control_type = "Yes/No";
          card.hasControls = true;

          let controls = { control: [] };

          let control = new Object();
          control.select_div_id = radioYesNoDiv.id;
          control.select_control_id = input.id;
          control.select_control_type = input.type;
          control.select_label_id = label.id;
          control.placeholder = input.placeholder;

          control.text = label.innerHTML;

          control.label_id = label.id;
          control.label_type = label.tagName;

          controls.control.push(control);

          let item = builder.find(
            (card) =>
              card.card_id === e.target.parentNode.parentNode.parentNode.id
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
            element.controls.control[index].select_div_id
          );

          radioYesNoParentDiv.appendChild(radioYesNoDiv);

          bodyWrapper.appendChild(radioYesNoParentDiv);

          let getRadioYesNoDiv = document.getElementById(
            element.controls.control[index].select_div_id
          );
          let input = document.createElement("input");
          input.type = "Radio";
          input.name = bodyWrapper.id;
          input.id = element.controls.control[index].select_control_id;
          let label = document.createElement("label");
          label.id = element.controls.control[index].select_label_id;

          let textYes = document.createTextNode(
            element.controls.control[index].text
          );

          label.appendChild(textYes);
          getRadioYesNoDiv.appendChild(input);
          getRadioYesNoDiv.appendChild(label);
          label.setAttribute("class", "radio-label-YesNo");
        }
      }
    } else if (e.target.value === "I Understand") {
      if (element !== null) {
        if (element.control_type != e.target.value) {
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
              card.card_id === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.control_require_id).disabled = false;
          item.controls = { control: [] };
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

        let textYes = document.createTextNode(
          "I understand and agree the terms and conditions"
        );

        label.appendChild(textYes);
        getChkConsentDiv.appendChild(input);
        getChkConsentDiv.appendChild(label);
        label.setAttribute("class", "radio-label");
        label.addEventListener("click", (e) => {
          editRadioOnClick(e, null);
        });

        let card = builder.find(
          (x) => x.card_id === e.target.parentNode.parentNode.parentNode.id
        );
        card.control_type = "I Understand";
        card.hasControls = true;

        let controls = { control: [] };
        let control = new Object();
        control.select_div_id = chkConsentDiv.id;
        control.inputControl_id = input.id;
        control.inputControl_type = input.type;
        control.input_placeholder = input.placeholder;

        control.label_i_understand = label.innerHTML;
        control.text = label.innerHTML;

        control.label_id = label.id;

        controls.control.push(control);

        let index = builder.find(
          (card) =>
            card.card_id === e.target.parentNode.parentNode.parentNode.id
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
          element.controls.control[0].select_div_id
        );

        chkConsentParentDiv.appendChild(chkConsentDiv);

        bodyWrapper.appendChild(chkConsentParentDiv);

        let getChkConsentDiv = document.getElementById(
          element.controls.control[0].select_div_id
        );
        let input = document.createElement("input");
        input.type = "checkbox";
        input.name = bodyWrapper.id;
        input.id = element.controls.control[0].inputControl_id;
        let label = document.createElement("label");
        label.id = element.controls.control[0].label_id;

        let textYes = document.createTextNode(element.controls.control[0].text);

        label.appendChild(textYes);
        getChkConsentDiv.appendChild(input);
        getChkConsentDiv.appendChild(label);
        label.setAttribute("class", "radio-label");
        label.addEventListener("click", (e) => {
          editRadioOnClick(e, null);
        });
      }
    } else if (e.target.value === "Multi Select") {
      if (element !== null) {
        if (element.control_type != e.target.value) {
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
              card.card_id === e.target.parentNode.parentNode.parentNode.id
          );
          document.getElementById(item.control_require_id).disabled = false;
          item.controls = { control: [] };
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
          (x) => x.card_id === e.target.parentNode.parentNode.parentNode.id
        );
        card.control_type = "Multi Select";
        card.hasControls = true;

        let controls = { control: [] };

        let control = new Object();
        control.select_div = multiSelectDiv.id;
        control.select_input_div = inputMultiSelectDiv.id;
        control.select_inputcontrol_div = inputControl.id;
        control.select_control_id = multiSelectControl.id;
        control.select_control_type = multiSelectControl.type;
        control.placeholder = inputControl.placeholder;

        control.options = { option: [] };

        controls.control.push(control);

        let index = builder.find(
          (card) =>
            card.card_id === e.target.parentNode.parentNode.parentNode.id
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
        multiSelectControl.id = element.controls.control[0].select_control_id;
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
    (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
  );
  index.controls.control.forEach((element) => {
    element.inputControl_type = e.target.value;
    element.placeholder = control.placeholder;
  });
};
const enterItemToDropDownList = (e, selectControl) => {
  if (e.key === "Enter") {
    e.preventDefault();
    let option = document.createElement("option");
    option.value = e.target.value;
    option.text = e.target.value;

    selectControl.appendChild(option);
    e.target.value = "";

    let options = new Object();
    options.option_text = option.text;
    options.option_value = option.value;
    options.option_disabled = option.disabled;
    options.option_selected = option.selected;

    let item = builder.find(
      (card) => card.controls.control[0].select_control_id === selectControl.id
    );
    item.controls.control[0].options.option.push(options);
  }
};
const deleteRadioElement = (e, remove) => {
  let filterControls = builder
    .find(
      (card) =>
        card.card_id === e.target.parentNode.parentNode.parentNode.parentNode.id
    )
    .controls.control.filter((x) => x.select_div_id !== e.target.parentNode.id);

  let controls = builder.find(
    (card) =>
      card.card_id === e.target.parentNode.parentNode.parentNode.parentNode.id
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

    let newRadio = radioDiv.parentNode.parentNode.insertBefore(
      radioParentDiv,
      radioDiv.parentNode
    );

    let input = document.createElement("input");
    input.type = "Radio";
    input.name = e.target.parentNode.parentNode.parentNode.id;
    input.id = AddRadioDiv.id + "_radio_" + currentIndex;
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

    let controls = { control: [] };

    let control = new Object();
    control.select_div_id =
      e.target.parentNode.parentNode.parentNode.parentNode.id +
      "_divRadio_" +
      currentIndex;
    control.select_control_id = input.id;
    control.select_control_type = input.type;
    control.placeholder = input.placeholder;

    control.text = label.innerHTML;

    control.label_id = label.id;
    control.label_type = label.tagName;

    controls.control.push(control);

    let item = builder.find(
      (card) =>
        card.card_id === e.target.parentNode.parentNode.parentNode.parentNode.id
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

    let newRadio = radioDiv.parentNode.parentNode.insertBefore(
      checkboxParentDiv,
      radioDiv.parentNode
    );

    let input = document.createElement("input");
    input.type = "checkbox";
    input.name = e.target.parentNode.parentNode.parentNode.id;
    input.id = AddCheckboxDiv.id + "_checkbox_" + currentIndex;
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
    let controls = { control: [] };

    let control = new Object();
    control.select_div_id =
      e.target.parentNode.parentNode.parentNode.id +
      "_divCheckbox_" +
      currentIndex;
    control.select_control_id = input.id;
    control.select_control_type = input.type;
    control.placeholder = input.placeholder;

    control.text = label.innerHTML;

    control.label_id = label.id;
    control.label_type = label.tagName;

    controls.control.push(control);

    let item = builder.find(
      (card) =>
        card.card_id === e.target.parentNode.parentNode.parentNode.parentNode.id
    );
    item.controls.control.push(controls.control[0]);

    label.click();
    hiddenIndexLabel.value = currentIndex;
  }
};

const updateRadioIndex = (e) => {
  let item = builder.find(
    (card) =>
      card.card_id === e.target.parentNode.parentNode.parentNode.parentNode.id
  );

  let currnetIndex = parseInt(item.hiddenIndex) + 1;
  item.hiddenIndex = currnetIndex;
  return (currnetIndex = parseInt(currnetIndex));
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
          card.card_id ===
          e.target.parentNode.parentNode.parentNode.parentNode.id
      )
      .controls.control.find((x) => x.select_div_id === e.target.parentNode.id);

    control.text = e.target.value;

    label.appendChild(newOption);
    label.setAttribute("class", "radio-label");
    label.addEventListener("click", (e) => {
      editOnLableClick(e, remove);
    });
    parent.replaceChild(label, replaceInputToLabel);
  }
};

const editOnLableClick = (e, remove) => {
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

const printFormBuilder = () => {
  let form_title_div = document.getElementById("form_title_div");
  let form_title = document.getElementById("form_title");
  let form_title_label = document.createElement("label");
  form_title_label.id = form_title.id;

  form_title_label.setAttribute(
    "class",
    "header-title-input header-title-label"
  );
  var form_title_label_text = document.createTextNode(form_title.value);

  let form_description_div = document.getElementById("form_description_div");
  let form_description = document.getElementById("form_description");
  let form_description_label = document.createElement("label");
  form_description_label.id = form_description.id;

  form_description_label.setAttribute(
    "class",
    "header-discription-input header-description-label"
  );
  var form_description_label_text = document.createTextNode(
    form_description.value
  );

  form_title_label.appendChild(form_title_label_text);
  form_title_div.replaceChild(form_title_label, form_title);
  form_description_label.appendChild(form_description_label_text);
  form_description_div.replaceChild(form_description_label, form_description);

  let form = { form: [] };
  form.form_title = form_title_label_text;
  form.form_description = form_description_label_text;
  builder[0].form_details = form;

  builder.forEach((element) => {
    let card = document.getElementById(element.card_id);
    let question = document.getElementById(element.question_id);

    if (question.value === "") {
      question.setAttribute("class", "question-input validation");
      throw "";
    } else {
      question.setAttribute("class", "question-input");
      element.question = question.value;
    }

    if (element.hasControls === undefined) {
      card.setAttribute("class", "card p-3 my-3 box-shadow-validation");
      throw "";
    } else if (element.hasControls !== undefined) {
      card.setAttribute("class", "card p-3 my-3");
    }
  });

  let mainDiv = document.getElementById("div_drager");
  mainDiv.innerHTML = "";

  builder.forEach((element) => {
    if (element.question !== undefined && element.hasControls === true) {
      if (element.control_type === "Input") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        var questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.card_id);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.question_id);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperId_id);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let input = document.createElement("input");
        input.setAttribute("class", "user-input-label");
        input.id = element.controls.control[0].inputControl_id;
        input.placeholder = element.controls.control[0].placeholder;
        input.type = element.controls.control[0].inputControl_type;

        input.required = element.controls.control[0].is_requried;
        inputParentDiv.appendChild(input);
        bodyWrapper.appendChild(inputParentDiv);
      } else if (element.control_type === "Multiline Text") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        var questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.card_id);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.question_id);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperId_id);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let input = document.createElement("textarea");
        input.setAttribute("class", "user-textarea-label");
        input.id = element.controls.control[0].inputControl_id;
        input.placeholder = element.controls.control[0].placeholder;

        input.required = element.controls.control[0].is_requried;
        inputParentDiv.appendChild(input);
        bodyWrapper.appendChild(inputParentDiv);
      } else if (element.control_type === "Date") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        var questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.card_id);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.question_id);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperId_id);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let input = document.createElement("input");
        input.setAttribute("class", "user-input-label date_items");
        input.id = element.controls.control[0].inputControl_id;
        input.placeholder = element.controls.control[0].placeholder;
        input.type = element.controls.control[0].inputControl_type;

        input.required = element.controls.control[0].is_requried;
        inputParentDiv.appendChild(input);
        bodyWrapper.appendChild(inputParentDiv);
      } else if (element.control_type === "I Understand") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        var questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.card_id);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.question_id);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperId_id);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let groupDiv = document.createElement("div");
        groupDiv.setAttribute("class", "d-flex justify-content-between py-2");

        let controldiv = document.createElement("div");
        controldiv.setAttribute("class", "d-flex align-item-center w-100");
        controldiv.id = element.controls.control[0].input_div_id;

        let input = document.createElement("input");
        input.id = element.controls.control[0].inputControl_id;
        input.placeholder = element.controls.control[0].placeholder;
        input.type = element.controls.control[0].inputControl_type;

        input.required = element.controls.control[0].is_requried;

        let label = document.createElement("label");
        label.id = element.controls.control[0].label_id;

        let textYes = document.createTextNode(element.controls.control[0].text);

        label.appendChild(textYes);
        controldiv.appendChild(input);
        controldiv.appendChild(label);
        label.setAttribute("class", "radio-label-label");
        groupDiv.appendChild(controldiv);
        bodyWrapper.appendChild(groupDiv);
      } else if (
        element.control_type === "Single Select" ||
        element.control_type === "Multi Select"
      ) {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        var questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.card_id);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.question_id);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperId_id);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        let inputParentDiv = document.createElement("div");
        inputParentDiv.setAttribute("class", "d-flex justify-content-between");

        let selectControl = document.createElement("select");
        selectControl.setAttribute("class", "user-input-label");
        selectControl.id = element.controls.control[0].select_control_id;
        selectControl.placeholder = element.controls.control[0].placeholder;

        selectControl.required = element.controls.control[0].is_requried;

        if (element.control_type === "Multi Select") {
          selectControl.multiple = true;
        }

        inputParentDiv.appendChild(selectControl);
        bodyWrapper.appendChild(inputParentDiv);

        let control = document.getElementById(selectControl.id);

        element.controls.control[0].options.option.forEach((item) => {
          let control_option = document.createElement("option");
          control_option.text = item.option_text;
          control_option.value = item.option_value;
          control_option.disabled = item.option_disabled;
          control_option.selected = item.option_selected;

          control.appendChild(control_option);
        });
      } else if (element.control_type === "Yes/No") {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        var questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.card_id);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.question_id);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperId_id);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        element.controls.control.forEach((option) => {
          let groupDiv = document.createElement("div");
          groupDiv.setAttribute("class", "d-flex justify-content-between py-2");

          let controldiv = document.createElement("div");
          controldiv.setAttribute("class", "d-flex align-item-center w-100");
          controldiv.id = option.select_div_id;

          let input = document.createElement("input");
          input.id = option.select_control_id;
          input.placeholder = option.placeholder;
          input.type = option.select_control_type;
          input.name = bodyWrapper.id;

          input.required = option.is_requried;
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
        element.control_type === "Radio" ||
        element.control_type === "Checkbox"
      ) {
        let inputCard = document.createElement("div");
        let innerDiv = document.createElement("div");
        var questionInput = document.createElement("label");

        innerDiv.setAttribute("class", "d-flex justify-content-between");
        inputCard.setAttribute("id", element.card_id);
        inputCard.setAttribute("class", "card p-3 my-3");
        questionInput.setAttribute("class", "question-input-label");
        questionInput.setAttribute("placeholder", "Question");
        questionInput.setAttribute("id", element.question_id);
        questionInput.innerText = element.question;

        inputCard.appendChild(innerDiv);
        mainDiv.appendChild(inputCard);
        innerDiv.appendChild(questionInput);

        let bodyWrapper = document.createElement("div");
        bodyWrapper.setAttribute("id", element.bodyWrapperId_id);
        bodyWrapper.setAttribute("class", "body-wrapper");
        inputCard.appendChild(bodyWrapper);

        element.controls.control.forEach((option) => {
          let groupDiv = document.createElement("div");
          groupDiv.setAttribute("class", "d-flex justify-content-between py-2");

          let controldiv = document.createElement("div");
          controldiv.setAttribute("class", "d-flex align-item-center w-100");
          controldiv.id = option.select_div_id;

          let input = document.createElement("input");
          input.id = option.select_control_id;
          input.placeholder = option.placeholder;
          input.type = option.select_control_type;
          input.name = bodyWrapper.id;

          if (element.control_type === "Radio") {
            input.required = option.is_requried;
          }

          let label = document.createElement("label");
          label.id = option.label_id;
          let textYes = document.createTextNode(option.text);

          label.appendChild(textYes);
          controldiv.appendChild(input);
          controldiv.appendChild(label);
          label.setAttribute("class", "radio-label-label");
          groupDiv.appendChild(controldiv);
          bodyWrapper.appendChild(groupDiv);
        });
      }
    }
  });
  validateCheckboxes({ currentTarget: form_builder });
  form_builder.addEventListener("change", validateCheckboxes);
};
const validateCheckboxes = (e) => {
  let wrappers = Array.from(
    e.currentTarget.querySelectorAll(":scope .body-wrapper")
  );
  builder.forEach((element) => {
    let control = builder
      .find((card) => card.card_id === element.card_id)
      .controls.control.find((x) => x.select_control_type === "checkbox");
    if (control !== undefined) {
      if (control.is_requried !== true) {
        let index = wrappers.indexOf(
          wrappers.find((x) => x.id === element.bodyWrapperId_id)
        );
        if (index > -1) {
          wrappers.splice(index, 1);
        }
      }
    } else if (control === undefined) {
      let index = wrappers.indexOf(
        wrappers.find((x) => x.id === element.bodyWrapperId_id)
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
  let form_title = document.getElementById("form_title");
  let form_description = document.getElementById("form_description");

  if (form_title.value === "") {
    form_title.setAttribute("class", "header-title-input validation");
    form_title.focus();
    is_completed = false;
    throw "Form Title cannot be null";
  } else if (form_title.value !== "") {
    form_title.setAttribute("class", "header-title-input");
  }
  if (form_description.value === "") {
    form_description.setAttribute(
      "class",
      "header-discription-input validation"
    );
    form_description.focus();
    is_completed = false;
    throw "Form Title cannot be null";
  } else if (form_description.value !== "") {
    form_description.setAttribute("class", "header-discription-input");
  }

  if (builder.length === 0) {
    alert("Please create form");
    throw "Please create form";
  }
  builder.forEach((element) => {
    is_completed = true;
    let question = document.getElementById(element.question_id);
    let bodyWrapper = document.getElementById(element.bodyWrapperId_id);

    if (question.value !== "") {
      element.question = question.value;
    } else if (question.value === "") {
      is_completed = false;
      question.setAttribute("class", "question-input validation");
      throw "value cannot be empty";
    }

    let select_type = document.getElementById(element.selectTag_id);
    if (select_type.value === "Select" || select_type.selectedIndex === 0) {
      is_completed = false;
      select_type.setAttribute("class", "select-control validation");
      throw "value cannot be empty";
    } else if (
      select_type.value !== "Select" ||
      select_type.selectedIndex !== 0
    ) {
      select_type.setAttribute("class", "select-control");
    }
    if (element.hasControls === undefined) {
      if (bodyWrapper.innerHTML === "") {
        is_completed = false;
        bodyWrapper.setAttribute("class", "validation-wrapper");
        throw "value cannot be empty";
      }
    } else if (element.hasControls !== undefined) {
      if (element.controls.control.length === 0) {
        bodyWrapper.setAttribute("class", "validation-wrapper");
        is_completed = false;
        throw "value cannot be empty";
      } else if (element.controls.control.length > 0) {
        bodyWrapper.setAttribute("class", "body-wrapper");
      }
    }

    if (
      element.control_type === "Multi Select" ||
      element.control_type === "Single Select"
    ) {
      if (element.controls.control[0].options.option.length === 0) {
        bodyWrapper.setAttribute("class", "validation-wrapper");
        is_completed = false;
        throw "value cannot be empty";
      } else if (element.controls.control[0].options.option.length > 0) {
        bodyWrapper.setAttribute("class", "body-wrapper");
      }
    }
  });

  //convert data to json
  if (is_completed) {
    let forms = {};
    forms.form_title = form_title.value;
    forms.form_description = form_description.value;
    builder[0].forms = forms;
    jsonData = JSON.stringify(builder);
    console.log(jsonData);
    let mainDiv = document.getElementById("div_drager");
    mainDiv.innerHTML = "";
    builder = [];
    //post data to database using API and pass builder as parameter
  }
};

const LoadFormBuilder = () => {
  builder = [];

  //Call API here to load data from database

  if (jsonData != null) {
    builder = JSON.parse(jsonData);
    let mainDiv = document.getElementById("div_drager");
    mainDiv.innerHTML = "";
    let form_title_div = document.getElementById("form_title_div");
    let form_title = document.getElementById("form_title");
    let form_title_input = document.createElement("input");
    form_title_input.id = form_title.id;

    form_title_input.setAttribute("class", "header-title-input");

    let form_description_div = document.getElementById("form_description_div");
    let form_description = document.getElementById("form_description");
    let form_description_input = document.createElement("input");
    form_description_input.id = form_description.id;

    form_description_input.setAttribute("class", "header-discription-input");

    form_title_div.replaceChild(form_title_input, form_title);
    form_description_div.replaceChild(form_description_input, form_description);

    form_title_input.value = builder[0].forms.form_title;
    form_description_input.value = builder[0].forms.form_description;
    builder.forEach((element) => {
      createCardFromJSON(mainDiv, element);
    });

    console.log(builder);
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
  var imgDelete = document.createElement("img");

  element.setAttribute("id", elements.card_id);

  var input = document.createElement("input");
  input.setAttribute("id", elements.inputId);
  input.setAttribute("style", "font-weight: bolder;");

  var select = document.createElement("select");
  selectTag.id = elements.selectTag_id;

  bodyWrapper.id = elements.bodyWrapperId_id;

  element.setAttribute("class", "card p-3 my-3");
  innerDiv.setAttribute("class", "d-flex justify-content-between");
  inputGroup.setAttribute("class", "input-group input-group-outline");
  selectGroup.setAttribute("class", "select-group");
  questionInput.setAttribute("class", "question-input");
  questionInput.setAttribute("placeholder", "Question");
  questionInput.setAttribute("id", elements.question_id);

  questionInput.value = elements.question;

  selectTag.setAttribute("class", "select-control");
  bodyWrapper.setAttribute("class", "body-wrapper");
  actionWrapper.setAttribute("class", "action-wrapper");
  imgDelete.setAttribute("src", "/assets/img/delete-icon.png");
  imgDelete.setAttribute("width", "20");
  footerLabel.setAttribute("class", "footer-label");
  formCheck.setAttribute("class", "form-check form-switch ps-0");

  requiredWrapper.setAttribute(
    "class",
    "d-flex align-items-center required-wrapper"
  );
  footerWrapper.setAttribute(
    "class",
    "footer-wrapper d-flex justify-content-end align-items-centerce"
  );
  inputCheckBox.setAttribute("class", "form-check-input ms-auto");
  inputCheckBox.setAttribute("type", "checkbox");
  inputCheckBox.id = elements.control_require_id;
  inputCheckBox.checked = elements.controls.control[0].is_requried;

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
  actionWrapper.appendChild(imgDelete);
  footerWrapper.appendChild(requiredWrapper);
  requiredWrapper.appendChild(footerLabel);
  requiredWrapper.appendChild(formCheck);
  formCheck.appendChild(inputCheckBox);

  imgDelete.addEventListener("click", (e) => {
    deleteCard(e, element);
  });

  inputCheckBox.addEventListener("change", (e) => {
    RequiredChanged(e, bodyWrapper);
  });

  for (var i = 0; i < listControls.length; i++) {
    var option = document.createElement("option");
    option.value = listControls[i];
    option.text = listControls[i];
    if (option.value === elements.control_type) {
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
      selectItemChanged(e, elements.bodyWrapperId_id, elements);
    },
    false
  );
  selectTag.dispatchEvent(new Event("change"));
};
