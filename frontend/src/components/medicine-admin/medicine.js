export const validateMedicine = (values) => {
    const errors = {};
  
    if (!values.name || values.name.length < 2) {
      errors.name = "Medicine name must be at least 2 characters";
    }
  
    if (!values.manufacturer || values.manufacturer.length < 2) {
      errors.manufacturer = "Manufacturer name must be at least 2 characters";
    }
  
    if (!values.dosage) {
      errors.dosage = "Dosage is required";
    }
  
    if (!values.type) {
      errors.type = "Please select a medicine type";
    }
  
    if (!values.price || values.price <= 0) {
      errors.price = "Price must be greater than 0";
    }
  
    if (values.stock < 0 || !Number.isInteger(Number(values.stock))) {
      errors.stock = "Stock must be a non-negative integer";
    }
  
    return errors;
  };