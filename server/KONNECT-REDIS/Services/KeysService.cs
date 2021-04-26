﻿using KONNECT_REDIS.Models;
using KONNECT_REDIS.Services.IServices;
using KONNECT_REDIS.utils;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KONNECT_REDIS.Services
{
    public class KeysService : IKeysService
    {
        private readonly IConnectionMultiplexer _multiplexer;
        private readonly IDatabase _db;

        public KeysService(IConnectionMultiplexer multiplexer)
        {
            _multiplexer = multiplexer;
            _db = _multiplexer.GetDatabase();
        }

        /// <summary>
        /// Retrieve All keys
        /// </summary>
       /// <returns>List of Keys</returns>
       public ICollection<Key> GetAllKeys(int? pageNumber, int pageSize)
        {
            var keys = _multiplexer.GetServer("localhost", 6379).Keys();
            
            var keyList = new List<Key>();

            foreach (var key in keys)
            {
                // ex key: IsFeatureActive#ad_emit_events#1
                // f1 === IsFeatureActive
                // f2 === ad_emit_event
                // f3? === 1
                var keyString = key.ToString();

                if (keyString.Split("#").Length == 3)
                {
                    var f1 = keyString.Split("#")[0];
                    var f2 = keyString.Split("#")[1];
                    var f3 = keyString.Split("#")[2];

                    var keyObj = new Key { KeyName = f1, Subset = f2, OrgId = f3 };

                    keyList.Add(keyObj);
                }
                else
                {
                    var f1 = keyString.Split("#")[0];
                    var f3 = keyString.Split("#")[1];
                   
                    var keyObj = new Key { KeyName = f1, Subset = "", OrgId = f3 };

                    keyList.Add(keyObj);
                }
            }

            // Pagination
            keyList = Paginate<Key>.Create(keyList.AsQueryable(), pageNumber ?? 1, pageSize);

            return keyList
                    .OrderBy(k => k.KeyName)
                    .ToList();
        }

        /// <summary>
        /// Retrieves a list of keys according to a Redis key pattern 
        /// </summary>
        /// <param name="pattern">A Redis key pattern</param>
        /// <param name="pageNumber">Page number</param>
        /// <returns></returns>
        public ICollection<Key> GetKeyByQuery(string pattern, int? pageNumber, int pageSize)
        {
            var server = _multiplexer.GetServer("localhost", 6379);

            var keyList = new List<Key>();

            foreach (var key in server.Keys(pattern: pattern))
            {
                var keyString = key.ToString();

                if (keyString.Split("#").Length == 3)
                {
                    var f1 = keyString.Split("#")[0];
                    var f2 = keyString.Split("#")[1];
                    var f3 = keyString.Split("#")[2];

                    var keyObj = new Key { KeyName = f1, Subset = f2, OrgId = f3 };

                    keyList.Add(keyObj);
                }
                else
                {
                    var f1 = keyString.Split("#")[0];
                    var f3 = keyString.Split("#")[1];

                    var keyObj = new Key { KeyName = f1, Subset = "", OrgId = f3 };

                    keyList.Add(keyObj);
                }
            }

            // Paginate
            keyList = Paginate<Key>.Create(keyList.AsQueryable(), pageNumber ?? 1, pageSize);
            
            return keyList
                .OrderBy(k => k.KeyName)
                .ToList();
        }

        /// <summary>
        /// Delete key
        /// </summary>
        /// <param name="keyName"></param>
        /// <param name="orgId"></param>
        /// <param name="subset">(optional)</param>
        /// <returns>True/False if key delete was success</returns>
        public bool DeleteKey(string keyName, string orgId, string subset = "")
        {
            if (subset.Equals(""))
            {
                return _db.KeyDelete($"{keyName}#{orgId}");
            }
            else
            {
                return _db.KeyDelete($"{keyName}#{subset}#{orgId}");
            }
        }
    }
}
