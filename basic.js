function checkoutDevice(ledger, assetTag, borrower) {
  if (!ledger.hasOwnProperty(assetTag)) {
    return { ledger: ledger, message: "Asset tag " + assetTag + " not found." };
  }
  if (ledger[assetTag].status === "CheckedOut") {
    return { ledger: ledger, message: "Device " + assetTag + " is already checked out." };
  }

  const updatedLedger = JSON.parse(JSON.stringify(ledger));
  updatedLedger[assetTag].borrower.name = borrower.name;
  updatedLedger[assetTag].borrower.email = borrower.email;
  updatedLedger[assetTag].status = "CheckedOut";

  return {
    ledger: updatedLedger,
    message: "Device " + assetTag + " checked out to " + borrower.name + "."
  };
}

function checkinDevice(ledger, assetTag) {
  if (!ledger.hasOwnProperty(assetTag)) {
    return { ledger: ledger, message: "Asset tag " + assetTag + " not found." };
  }

  const updatedLedger = JSON.parse(JSON.stringify(ledger));
  updatedLedger[assetTag].borrower.name = "";
  updatedLedger[assetTag].borrower.email = "";
  updatedLedger[assetTag].dueDate = "";
  updatedLedger[assetTag].status = "CheckedIn";

  return {
    ledger: updatedLedger,
    message: "Device " + assetTag + " checked in."
  };
}

function listOverdueDevices(ledger, today) {
  const todayParts = today.split('/');
  const todayDate = {
    year: parseInt(todayParts[2], 10),
    month: parseInt(todayParts[0], 10),
    day: parseInt(todayParts[1], 10)
  };

  const overdue = [];

  for (const tag in ledger) {
    const device = ledger[tag];
    if (device.status === "CheckedOut" && device.dueDate) {
      const dueParts = device.dueDate.split('/');
      const dueDate = {
        year: parseInt(dueParts[2], 10),
        month: parseInt(dueParts[0], 10),
        day: parseInt(dueParts[1], 10)
      };

      let isOverdue = false;
      if (dueDate.year < todayDate.year) {
        isOverdue = true;
      } else if (dueDate.year === todayDate.year) {
        if (dueDate.month < todayDate.month) {
          isOverdue = true;
        } else if (dueDate.month === todayDate.month) {
          if (dueDate.day < todayDate.day) {
            isOverdue = true;
          }
        }
      }

      if (isOverdue) {
        overdue.push(device);
      }
    }
  }

  overdue.sort((a, b) => {
    const aParts = a.dueDate.split('/');
    const bParts = b.dueDate.split('/');

    const aYear = parseInt(aParts[2], 10);
    const bYear = parseInt(bParts[2], 10);
    if (aYear !== bYear) return aYear - bYear;

    const aMonth = parseInt(aParts[0], 10);
    const bMonth = parseInt(bParts[0], 10);
    if (aMonth !== bMonth) return aMonth - bMonth;

    const aDay = parseInt(aParts[1], 10);
    const bDay = parseInt(bParts[1], 10);
    return aDay - bDay;
  });

  return overdue;
}

function serializeLedger(ledger) {
  return JSON.stringify(ledger);
}

function loadLedger(json) {
  return JSON.parse(json);
}
