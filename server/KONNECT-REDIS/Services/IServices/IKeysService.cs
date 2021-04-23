﻿using KONNECT_REDIS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KONNECT_REDIS.Services.IServices
{
    public interface IKeysService
    {
        ICollection<Key> GetAllKeys(int? pageNumber);
        ICollection<Key> GetKeyByQuery(string pattern, int? pageNumber);
        bool DeleteKey(string keyName, string orgId, string subset = "");
    }
}
