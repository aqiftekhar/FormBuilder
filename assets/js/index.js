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

class formBuilder {
  constructor(card_id, question_id, bodyWrapper_id) {
    this.card_id = card_id;
    this.question_id = question_id;
    this.bodyWrapper_id = bodyWrapper_id;
  }
}

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

  let object = new Object();
  object.card_id = card;
  object.question_id = questionInput.id;
  object.question_placeholder = questionInput.placeholder;
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
      selectItemChanged(e, bodyWrapperId);
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
            // parent.required = true;
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

const selectItemChanged = (e, bodyWrapperId) => {
  if (e.target.value !== "select") {
    if (e.target.value === "Input") {
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (bodyWrapper != null) {
        bodyWrapper.innerHTML = "";

        let item = builder.find(
          (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
        );
        item.controls = { control: [] };

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
      inputControl.setAttribute("class", "user-input");
      inputControl.setAttribute(
        "placeholder",
        "Please enter your answere here..."
      );
      getInputDiv.appendChild(inputControl);

      let inputTypes = document.createElement("select");

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

      controls.control.push(control);

      let index = builder.find(
        (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
      );
      index.controls = controls;
    } else if (e.target.value === "Multiline Text") {
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (bodyWrapper != null) {
        bodyWrapper.innerHTML = "";

        let item = builder.find(
          (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
        );
        item.controls = { control: [] };

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
        (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
      );
      index.controls = controls;
    } else if (e.target.value === "Radio") {
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (bodyWrapper != null) {
        bodyWrapper.innerHTML = "";
  
        let item = builder.find(
          (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
        );
        item.controls = { control: [] };

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

          let controls = { control: [] };

          let control = new Object();
          control.select_div_id =
            e.target.parentNode.parentNode.parentNode.id + "_divRadio_" + index;
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
          link.id = getDiv.id + "_AddNewOption_" + index;
          link.setAttribute("class", "new-radio-option");
          getDiv.appendChild(link);
          link.addEventListener("click", (e) => {
            AddNewOption(e, "Radio", getDiv, radioDiv, index, hiddenIndexLabel);
          });
        }
      }
    } else if (e.target.value === "Checkbox") {
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (bodyWrapper != null) {
        bodyWrapper.innerHTML = "";

        let item = builder.find(
          (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
        );
        item.controls = { control: [] };

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
          e.target.parentNode.parentNode.parentNode.id + "_divCheckbox_" + index
        );

        checkboxParentDiv.appendChild(checkboxDiv);

        bodyWrapper.appendChild(checkboxParentDiv);

        let getCheckboxDiv = document.getElementById(
          e.target.parentNode.parentNode.parentNode.id + "_divCheckbox_" + index
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
    } else if (e.target.value === "Single Select") {
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (bodyWrapper != null) {
        bodyWrapper.innerHTML = "";
        let item = builder.find(
          (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
        );
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

      let option = document.createElement("option");
      option.value = "Choose one option";
      option.text = "Choose one option";
      option.disabled = true;
      option.selected = true;
      selectControl.appendChild(option);

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
      control.select_div_id =
        e.target.parentNode.parentNode.parentNode.id + "_divInputSelect";
      control.select_control_id = selectControl.id;
      control.select_control_type = selectControl.type;
      control.placeholder = selectControl.placeholder;

      let options = new Object();
      options.option_text = option.text;
      options.option_value = option.value;
      options.option_disabled = option.disabled;
      options.option_selected = option.selected;

      control.options = { option: [] };

      control.options.option.push(options);
      controls.control.push(control);

      let index = builder.find(
        (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
      );
      index.controls = controls;
    } else if (e.target.value === "Date") {
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (bodyWrapper != null) {
        bodyWrapper.innerHTML = "";
        let item = builder.find(
          (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
        );
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
        (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
      );
      index.controls = controls;
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
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (bodyWrapper != null) {
        bodyWrapper.innerHTML = "";
        let item = builder.find(
          (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
        );
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
        control.select_div_id =
          e.target.parentNode.parentNode.parentNode.id +
          "_divRadioYesNo_" +
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
      }
    } else if (e.target.value === "I Understand") {
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (bodyWrapper != null) {
        bodyWrapper.innerHTML = "";
        let item = builder.find(
          (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
        );
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
      control.input_div_id =
        e.target.parentNode.parentNode.parentNode.id +
        "_divCheckbox_Iunderstand";
      control.inputControl_id = input.id;
      control.inputControl_type = input.type;
      control.input_placeholder = input.placeholder;

      control.label_i_understand = label.innerHTML;

      control.label_id = label.id;
      control.label_text = label.text;

      controls.control.push(control);

      let index = builder.find(
        (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
      );
      index.controls = controls;
    } else if (e.target.value === "Multi Select") {
      let bodyWrapper = document.getElementById(bodyWrapperId);
      if (bodyWrapper != null) {
        bodyWrapper.innerHTML = "";
        let item = builder.find(
          (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
        );
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
        e.target.parentNode.parentNode.parentNode.id + "_div_multi_Input_Select"
      );
      selectInputParentDiv.appendChild(inputMultiSelectDiv);
      bodyWrapper.appendChild(selectInputParentDiv);

      let getInputMultiSelectDiv = document.getElementById(
        e.target.parentNode.parentNode.parentNode.id + "_div_multi_Input_Select"
      );
      let inputControl = document.createElement("input");
      inputControl.id = getInputMultiSelectDiv.id + "_multi_select_Input_" + 1;
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

      let option = document.createElement("option");
      option.value = "Choose one option";
      option.text = "Choose one option";
      option.disabled = true;
      option.selected = true;
      multiSelectControl.appendChild(option);

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
      control.select_div_id =
        e.target.parentNode.parentNode.parentNode.id + "_div_multi_select";
      control.select_control_id = multiSelectControl.id;
      control.select_control_type = multiSelectControl.type;
      control.placeholder = multiSelectControl.placeholder;

      let options = new Object();
      options.option_text = option.text;
      options.option_value = option.value;
      options.option_disabled = option.disabled;
      options.option_selected = option.selected;

      control.options = { option: [] };

      control.options.option.push(options);
      controls.control.push(control);

      let index = builder.find(
        (card) => card.card_id === e.target.parentNode.parentNode.parentNode.id
      );
      index.controls = controls;
    }
  }
};
const onInputTypeChange = (e, control) => {
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
    let currentIndex = updateRadioIndex(hiddenIndexLabel);
    currentIndex = currentIndex + 1;
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
    let currentIndex = updateRadioIndex(hiddenIndexLabel);
    currentIndex = currentIndex + 1;
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

const updateRadioIndex = (hiddenIndexLabel) => {
  let label = document.getElementById(hiddenIndexLabel.id);
  return (currnetIndex = parseInt(label.value));
};

const changeInputToLabel = (e, remove, prevValue) => {
  debugger;
  let parent = document.getElementById(e.target.parentNode.id);
  if (e.target.tagName === "INPUT" && e.target.value === "") {
    // e.target.previousSibling.remove();
    // e.target.nextSibling.remove();
    // e.target.remove();
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

const saveFormBuilder = () => {

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

        let textYes = document.createTextNode(
          "I understand and agree the terms and conditions"
        );

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

          input.required = option.is_requried;
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
};